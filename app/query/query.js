'use strict';

(function () {

  var app = angular.module('antismash.db.ui.query', [
    'ngResource',
    'antismash.db.ui.queryterm'
  ]);

  app.factory('Downloader', ['$resource', '$q', function ($resource, $q) {

    function handleError(data, status) {
      var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
      var error = JSON.parse(decodedString);
      return {
        response: error,
        status: status
      }
    }

    var MIME_MAP = {
      csv: 'text/csv',
      fasta: 'application/fasta',
      json: 'application/json'
    }

    function generate_handler(type) {
      var options = {
        method: 'POST',
        headers: {
          accept: MIME_MAP[type]
        },
        responseType: 'arraybuffer',
        cache: true,
        transformResponse: function (data, getter, status) {
          var response;

          if (status != 200) {
            return handleError(data, status);
          }

          if (data) {
            response = new Blob([data], {
              type: MIME_MAP[type]
            });
          }
          return {
            response: response
          };
        }
      };
      return options;
    }

    return $resource('/api/v1.0/export', null, {
      csv: generate_handler('csv'),
      fasta: generate_handler('fasta'),
      fastaa: generate_handler('fasta'),
      json: generate_handler('json')
    });
  }]);

  app.controller('QueryController', ['$http', '$window', '$stateParams', 'Downloader', 'bowser',
    function ($http, $window, $stateParams, Downloader, bowser) {

      var vm = this;

      vm.bowser = bowser;
      vm.search_string = '';
      vm.isValidSearch = isValidSearch;
      vm.search = search;
      vm.simpleSearch = simpleSearch;
      vm.showCluster = showCluster;
      vm.canLoadMore = canLoadMore;
      vm.loadMore = loadMore;
      vm.getNcbiUrl = getNcbiUrl;
      vm.getMibigUrl = getMibigUrl;
      vm.hitQuality = hitQuality;
      vm.addEntry = addEntry;
      vm.removeEntry = removeEntry;
      vm.loadSimpleExample = loadSimpleExample;
      vm.loadComplexExample = loadComplexExample;
      vm.resetSearch = resetSearch;
      vm.downloadCsv = downloadCsv;
      vm.exportFile = exportFile;
      vm.getExportUrl = getExportUrl;
      vm.showSearch = showSearch;
      vm.graphicalPossible = graphicalPossible;
      vm.search_pending = false;
      vm.download_pending = false;
      vm.search_done = false;
      vm.download_done = false;
      vm.loading_more = false;
      vm.ran_simple_search = false;

      vm.hide_stats = true;
      vm.clusters_by_type_options = {
        title: {display: true, text: 'Clusters by types'},
        scales: {
          xAxes: [{ ticks: { autoSkip: false} }],
          yAxes: [{ ticks: {min: 0} }]
        }
      };
      vm.clusters_by_phylum_options = {
        title: {display: true, text: 'Clusters by phylum'},
        scales: {
          xAxes: [{ ticks: { autoSkip: false} }],
          yAxes: [{ ticks: {min: 0} }]
        }
      };

      vm.query = {
        search: 'cluster',
        return_type: 'json',
        verbose: false,
        terms: {
          term_type: 'expr',
          category: '',
          term: ''
        }
      };

      vm.results = {};

      if ($stateParams.search_string) {
        vm.search_string = $stateParams.search_string;
        simpleSearch();
      }

      function isValidSearch() {
        if (!vm.query) {
          return false;
        }
        if (!vm.query.terms) {
          return false;
        }
        return isValidTerm(vm.query.terms);
      }

      /* Recursively check if a term is valid
         Terms are considered valid if their category and term are not an
         empty string
       */
      function isValidTerm(term) {
        if (term.term_type == 'expr') {
          if (term.category === '') {
            return false;
          }
          if (term.term === '') {
            return false;
          }
          return true;
        }
        if (term.term_type == 'op') {
          return isValidTerm(term.left) && isValidTerm(term.right);
        }
        return false;
      }

      function search() {
        if (!isValidSearch()){
          return;
        }
        vm.search_pending = true;
        $http.post('/api/v1.0/search', {query: vm.query}).then(
          function(results){
            vm.results = results.data;
            vm.search_pending = false;
            vm.search_done = true;
            vm.ran_simple_search = false;
          }
        );
      };

      function simpleSearch() {
        vm.search_pending = true;
        $http.post('/api/v1.0/search', {search_string: vm.search_string}).then(
          function(results){
            vm.results = results.data;
            vm.search_pending = false;
            vm.search_done = true;
            vm.ran_simple_search = true;
          }
        )
      };

      function canLoadMore() {
        if (vm.results && vm.results.clusters) {
          return vm.results.clusters.length < vm.results.total;
        }
        return false;
      }

      function loadMore() {
        var next_offset = vm.results.offset + vm.results.paginate;
        var search_obj = {
          offset: next_offset
        };

        if (vm.ran_simple_search) {
          search_obj.search_string = vm.search_string;
        } else {
          search_obj.query = vm.query;
        }

        vm.loading_more = true;
        $http.post('/api/v1.0/search', search_obj).then(
          function(results){
            vm.loading_more = false;
            var new_clusters = results.data.clusters;
            for (var i = 0; i < new_clusters.length; i++) {
              vm.results.clusters.push(new_clusters[i]);
            }
            vm.results.offset = results.data.offset;
          }
        )
      }

      function showCluster(entry) {
        var cluster_acc = entry.acc + '_c' + entry.cluster_number;
        $window.open('/output/' + entry.assembly_id + '/index.html#cluster-' + entry.cluster_number, '_blank');
      };

      function getNcbiUrl(accession) {
        if (!accession){
          return '';
        }
        return "https://www.ncbi.nlm.nih.gov/genome/?term=" + accession;
      }

      function getMibigUrl(accession) {
        if (!accession) {
          return '';
        }
        var acc = accession.split(/_/)[0];
        return "https://mibig.secondarymetabolites.org/repository/" + acc + "/index.html#cluster-1";
      };

      function hitQuality(similarity) {
        if (similarity >= 75) {
          return "similarity-high";
        }
        if (similarity >= 50) {
          return "similarity-medium";
        }
        return "similarity-low";
      }

      function addEntry(){
        vm.search_objects.push({category: {val: 'type', desc:'BGC type'}, term: '', operation: 'and'});
      };

      function removeEntry(entry){
        var idx = vm.search_objects.indexOf(entry);
        if (idx > -1) {
          vm.search_objects.splice(idx, 1);
        }
      };

      function loadSimpleExample(entry){
        vm.search_string = 'lantipeptide Streptomyces';
      };

      function loadComplexExample(entry) {
        vm.query = {
          search: 'cluster',
          return_type: 'json',
          terms: {
            term_type: 'op',
            operation: 'and',
            left: {
              term_type: 'expr',
              category: 'type',
              term: 'ripp'
            },
            right: {
              term_type: 'op',
              operation: 'or',
              left: {
                term_type: 'expr',
                category: 'genus',
                term: 'Streptomyces'
              },
              right: {
                term_type: 'expr',
                category: 'genus',
                term: 'Lactococcus'
              }
            }
          }
        };
      }

      function resetSearch(){
        vm.search_done = false;
        vm.search_pending = false;
        vm.download_done = false;
        vm.download_pending = false;
        vm.download_failed = false;
        vm.results = {};
      };

      function showSearch() {
        if (vm.query == {}){
          return true;
        };
        if (graphicalPossible()) {
          if (vm.query.return_type == 'json') {
            return true;
          }
        }
        return false;
      };

      function graphicalPossible() {
        if (vm.query.search == 'cluster') {
          return true;
        }
        return false;
      }

      function downloadCsv(){
        if (vm.query) {
          vm.query.return_type = 'csv';
        }
        exportFile();
      }

      function getExportUrl() {
        var search_string;
        var search_type = 'cluster';
        var return_type = 'csv';
        if (vm.ran_simple_search) {
          search_string = encodeURIComponent(vm.search_string);
        } else {
          search_type = vm.query.search;
          return_type = vm.query.return_type;
          search_string = encodeURIComponent(queryToString(vm.query.terms));
        }
        var search =  '/api/v1.0/export/' + search_type + '/' + return_type + '?search=' + search_string;
        return search;
      };

      function queryToString(term){
        if (term.term_type == 'expr') {
          return '[' + term.category + ']' + term.term;
        }
        if (term.term_type == 'op') {
          return '( ' + queryToString(term.left) + ' '
                      + term.operation.toUpperCase() + ' '
                      + queryToString(term.right) + ' )';
        }
      }

      function exportFile(){
        var search_obj;
        if (vm.ran_simple_search) {
          search_obj = {search_string: vm.search_string};
        } else {
          search_obj = {query: vm.query};
        }
        var format = 'csv';
        if (vm.query && vm.query.return_type) {
          format = vm.query.return_type;
        }
        vm.download_pending = true;
        return Downloader[format](null, search_obj).$promise.then(function (data) {
          var blob = data.response;

          vm.download_pending = false;
          vm.download_done = true;

          $window.saveAs(blob, 'asdb_search_results.' + format);
        }).catch(function(error){
          console.log(error);
          vm.download_pending = false;
          vm.download_done = false;
          vm.download_failed = true;
          if (error.data.response.error) {
            vm.failure_reason = error.data.response.error;
          } else {
            vm.failure_reason = error.statusText;
          }
        });
      };

    }]);

})();

'use strict';

(function () {

  var app = angular.module('antismash.db.ui.query', [
    'ngResource',
    'antismash.db.ui.queryterm'
  ]);

  app.factory('Downloader', ['$resource', function ($resource) {
    return $resource('/api/v1.0/export', null, {
      csv: {
        method: 'POST',
        headers: {
          accept: 'text/csv'
        },
        responseType: 'arraybuffer',
        cache: true,
        transformResponse: function (data) {
          var csv;
          if (data) {
            csv = new Blob([data], {
              type: 'text/csv'
            });
          }
          return {
            response: csv
          };
        }
      },
      fasta: {
        method: 'POST',
        headers: {
          accept: 'application/fasta'
        },
        responseType: 'arraybuffer',
        cache: true,
        transformResponse: function (data) {
          var fasta;
          if (data) {
            fasta = new Blob([data], {
              type: 'application/fasta'
            });
          }
          return {
            response: fasta
          };
        }
      },
      json: {
        method: 'POST',
        headers: {
          accept: 'application/json'
        },
        responseType: 'arraybuffer',
        cache: true,
        transformResponse: function (data) {
          var json;
          if (data) {
            json = new Blob([data], {
              type: 'application/json'
            });
          }
          return {
            response: json
          };
        }
      }
    });
  }]);

  app.controller('QueryController', ['$http', '$window', 'Downloader',
    function ($http, $window, Downloader) {

      var vm = this;

      vm.search_string = '';
      vm.isValidSearch = isValidSearch;
      vm.search = search;
      vm.simpleSearch = simpleSearch;
      vm.showCluster = showCluster;
      vm.canLoadMore = canLoadMore;
      vm.loadMore = loadMore;
      vm.getNcbiUrl = getNcbiUrl;
      vm.getMibigUrl = getMibigUrl;
      vm.addEntry = addEntry;
      vm.removeEntry = removeEntry;
      vm.loadSimpleExample = loadSimpleExample;
      vm.loadComplexExample = loadComplexExample;
      vm.resetSearch = resetSearch;
      vm.downloadCsv = downloadCsv;
      vm.exportFile = exportFile;
      vm.showSearch = showSearch;
      vm.graphicalPossible = graphicalPossible;
      vm.search_pending = false;
      vm.search_done = false;
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
        terms: {
          term_type: 'expr',
          category: '',
          term: ''
        }
      };

      vm.results = {};

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
          if (term.category == '') {
            return false;
          }
          if (term.term == '') {
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
          search_string: vm.search_string,
          offset: next_offset
        };
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
        $window.open('/output/' + entry.acc + '/index.html#cluster-' + entry.cluster_number, '_blank');
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
        return Downloader[format](null, search_obj).$promise.then(function (data) {
          var blob = data.response;

          $window.saveAs(blob, 'asdb_search_results.' + format);
        });
      };

    }]);

})();

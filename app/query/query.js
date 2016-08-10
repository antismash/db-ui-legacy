'use strict';

(function () {

  var app = angular.module('antismash.db.ui.query', ['ngResource']);

  app.factory('Csv', ['$resource', function ($resource) {
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
      }
    });
  }]);

  app.controller('QueryController', ['$http', '$window', 'Csv',
    function ($http, $window, Csv) {

      var vm = this;

      vm.search_string = '';
      vm.search = search;
      vm.simpleSearch = simpleSearch;
      vm.showCluster = showCluster;
      vm.canLoadMore = canLoadMore;
      vm.loadMore = loadMore;
      vm.getNcbiUrl = getNcbiUrl;
      vm.getMibigUrl = getMibigUrl;
      vm.addEntry = addEntry;
      vm.removeEntry = removeEntry;
      vm.loadExample = loadExample;
      vm.resetSearch = resetSearch;
      vm.downloadCsv = downloadCsv;
      vm.getTerms = getTerms;
      vm.search_pending = false;
      vm.search_done = false;
      vm.loading_more = false;

      vm.search_objects = [
        {category: {val: 'type', desc: 'BGC type'}, term: '', operation: 'and'}
      ];

      vm.categories = [
        {val: 'type', desc: 'BGC type'},
        {val: 'monomer', desc: 'Monomer'},
        {val: 'acc', desc: 'NCBI Accession'},
        {val: 'compound_seq', desc: 'Compound sequence'},
        {val: 'species', desc: 'Species'},
        {val: 'genus', desc: 'Genus'},
        {val: 'family', desc: 'Family'},
        {val: 'order', desc: 'Order'},
        {val: 'class', desc: 'Class'},
        {val: 'phylum', desc: 'Phylum'},
        {val: 'superkingdom', desc: 'Superkingdom'}
      ]

      vm.results = {};

      function search() {
        var compiled_search = [];
        vm.search_objects.forEach(function(el) {
          if (el.term != ''){
            compiled_search.push('[' + el.category.val + ':' + (el.operation?el.operation:'and') + ']' + el.term);
          }
        }, this);
        vm.search_string = compiled_search.join(' ');
        if (vm.search_string != '') {
          vm.simpleSearch();
        }
      }

      function simpleSearch() {
        vm.search_pending = true;
        $http.post('/api/v1.0/search', {search_string: vm.search_string}).then(
          function(results){
            vm.results = results.data;
            vm.search_pending = false;
            vm.search_done = true;
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
        $window.open('/output/' + entry.acc + '/index.html#cluster-' + entry.cluster_number, '_new');
      };

      function getNcbiUrl(accession) {
        if (!accession){
          return '';
        }
        return "http://www.ncbi.nlm.nih.gov/genome/?term=" + accession;
      }

      function getMibigUrl(accession) {
        if (!accession) {
          return '';
        }
        var acc = accession.split(/_/)[0];
        return "http://mibig.secondarymetabolites.org/repository/" + acc + "/index.html#cluster-1";
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

      function loadExample(entry){
        vm.search_objects = [
          {
            category: {val: 'type', desc: 'BGC type'},
            term: 'lantipeptide'
          },
          {
            category: {val: 'genus', desc: 'Genus'},
            term: 'Streptomyces'
          }
        ];
        vm.search_string = 'lantipeptide Streptomyces';
      };

      function resetSearch(){
        vm.search_done = false;
        vm.search_pending = false;
        vm.results = {};
      };

      function downloadCsv(){
        return Csv.csv(null, {search_string: vm.search_string}).$promise.then(function (data) {
          var blob = data.response;
          $window.saveAs(blob, 'asdb_search_results.cvs');
        });
      };

      function getTerms(category, term){
        return $http.get('/api/v1.0/available/' + category.val + '/' + term)
        .then(function(response){
          return response.data;
        });
      };

    }]);

})();

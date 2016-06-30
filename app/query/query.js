'use strict';

(function () {

  var app = angular.module('antismash.db.ui.query', [

  ]);

  app.controller('QueryController', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {

      var vm = this;

      vm.search_string = '';
      vm.search = search;
      vm.simpleSearch = simpleSearch;
      vm.showCluster = showCluster;
      vm.getMibigUrl = getMibigUrl;
      vm.addEntry = addEntry;
      vm.removeEntry = removeEntry;
      vm.loadExample = loadExample;

      vm.search_objects = [
        {category: {val: 'type', desc: 'BGC type'}, term: ''}
      ];

      vm.categories = [
        {val: 'type', desc: 'BGC type'},
        {val: 'monomer', desc: 'Monomer'},
        {val: 'acc', desc: 'NCBI Accession'},
        {val: 'compound_seq', desc: 'Compound sequence'},
        {val: 'species', desc: 'Species'},
        {val: 'genus', desc: 'Genus'},
        {val: 'family', desc: 'Family'}
      ]

      vm.results = [];

      function search() {
        var compiled_search = [];
        vm.search_objects.forEach(function(el) {
          if (el.term != ''){
            compiled_search.push('[' + el.category.val + ']' + el.term);
          }
        }, this);
        vm.search_string = compiled_search.join(' ');
        if (vm.search_string != '') {
          vm.simpleSearch();
        }
      }

      function simpleSearch() {
        $http.post('/api/v1.0/search', {search_string: vm.search_string}).then(
          function(results){
            vm.results = results.data;
          }
        )
      };

      function showCluster(entry) {
        var cluster_acc = entry.acc + '_c' + entry.cluster_number;
        location.href = '/output/' + entry.acc + '/index.html#cluster-' + entry.cluster_number;
        //$state.go('show.cluster', {id: cluster_acc});
      };

      function getMibigUrl(accession) {
        if (!accession) {
          return '';
        }
        var acc = accession.split(/_/)[0];
        return "http://mibig.secondarymetabolites.org/repository/" + acc + "/index.html#cluster-1";
      };

      function addEntry(){
        vm.search_objects.push({category: {val: 'type', desc:'BGC type'}, term: ''});
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

    }]);

})();

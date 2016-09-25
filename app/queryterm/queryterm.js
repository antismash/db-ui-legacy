'use strict'

angular.module('antismash.db.ui.queryterm', [])
  .controller('QueryTermCtrl', ['$scope', '$http', 'CategorySvc',
    function ($scope, $http, CategorySvc) {
    var vm = this;
    vm.categories = CategorySvc.categories;
    vm.getTerms = getTerms;
    vm.remove = remove;
    vm.add = add;
    vm.swap = swap;

    function remove(term){
      if(vm.term.right == term){
        vm.term = vm.term.left;
        return;
      }
      if(vm.term.left == term){
        vm.term = vm.term.right;
      }
    };

    function add(){
      var new_op = {
        term_type: 'op',
        operation: 'and',
        left: vm.term,
        right: {
          term_type: 'expr',
          category: '',
          term: '',
        }
      };
      vm.term = new_op;
    }

    function swap(){
      var tmp = vm.term.left;
      vm.term.left = vm.term.right;
      vm.term.right = tmp;
    }

    function getTerms(term){
        return $http.get('/api/v1.0/available/' + vm.term.category + '/' + term)
        .then(function(response){
          return response.data.map(function(value){
            return value[0];
          });
        });
    };
  }])
  .factory('CategorySvc', function () {
    var categories = [
        {val: '', desc: '--- Select one ---'},
        {val: 'type', desc: 'BGC type'},
        {val: 'monomer', desc: 'Monomer'},
        {val: 'acc', desc: 'NCBI Accession'},
        {val: 'compoundseq', desc: 'Compound sequence'},
        {val: 'strain', desc: 'Strain'},
        {val: 'species', desc: 'Species'},
        {val: 'genus', desc: 'Genus'},
        {val: 'family', desc: 'Family'},
        {val: 'order', desc: 'Order'},
        {val: 'class', desc: 'Class'},
        {val: 'phylum', desc: 'Phylum'},
        {val: 'superkingdom', desc: 'Superkingdom'}
      ];

    return {
      categories: categories
    };
  })
  .directive('asQueryTerm', function () {
    return {
      scope: {},
      bindToController: {
        term: '='
      },
      templateUrl: 'queryterm/queryterm.html',
      controller: 'QueryTermCtrl',
      controllerAs: 'ctrl'
    }
  });

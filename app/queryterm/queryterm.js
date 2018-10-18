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

    function getTerms(term) {
      if (vm.term.category == '') {
        return [];
      }
      return $http.get('/api/v1.0/available/' + vm.term.category + '/' + term)
        .then(function (response) {
          return response.data;
      });
    };
  }])
  .factory('CategorySvc', function () {
    var categories = [
        {val: '', desc: '--- Select a category ---'},
        {val: 'acc', desc: 'NCBI RefSeq Accession'},
        {val: 'assembly', desc: 'NCBI assembly ID'},
        {val: 'type', desc: 'BGC type', category: 'antiSMASH predictions'},
        {val: 'monomer', desc: 'Monomer', category: 'antiSMASH predictions'},
        {val: 'compoundseq', desc: 'Compound sequence', category: 'Compound properties'},
        {val: 'compoundclass', desc: 'RiPP Compound class', category: 'Compound properties'},
        {val: 'profile', desc: 'Biosynthetic profile', category: 'antiSMASH predictions'},
        {val: 'asdomain', desc: 'NRPS/PKS domain', category: 'antiSMASH predictions'},
        {val: 'terpene', desc: 'Terpene synthase type', category: 'antiSMASH predictions'},
        {val: 'terpenefromcarbon', desc: 'Terpene cyclisation from carbon atom', category: 'antiSMASH predictions'},
        {val: 'terpenetocarbon', desc: 'Terpene cyclisation to carbon atom', category: 'antiSMASH predictions'},
        {val: 'smcog', desc: 'smCoG hit', category: 'antiSMASH predictions'},
        {val: 'contigedge', desc: 'Cluster on contig edge', category: 'Quality filters'},
        {val: 'minimal', desc: 'Cluster with minimal predictions', category: 'Quality filters'},
        {val: 'strain', desc: 'Strain', category: 'Taxonomy'},
        {val: 'species', desc: 'Species', category: 'Taxonomy'},
        {val: 'genus', desc: 'Genus', category: 'Taxonomy'},
        {val: 'family', desc: 'Family', category: 'Taxonomy'},
        {val: 'order', desc: 'Order', category: 'Taxonomy'},
        {val: 'class', desc: 'Class', category: 'Taxonomy'},
        {val: 'phylum', desc: 'Phylum', category: 'Taxonomy'},
        {val: 'superkingdom', desc: 'Superkingdom', category: 'Taxonomy'},
        {val: 'clusterblast', desc: 'ClusterBlast hit', category: 'Similar clusters'},
        {val: 'knowncluster', desc: 'KnownClusterBlast hit', category: 'Similar clusters'},
        {val: 'subcluster', desc: 'SubClusterBlast hit', category: 'Similar clusters'}
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

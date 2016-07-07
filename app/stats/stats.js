'use strict';

(function () {

  var app = angular.module('antismash.db.ui.stats', [

  ]);

  app.controller('StatsController', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {

      var vm = this;
      vm.general_stats = [
        { 'name': 'Secondary metabolite clusters', 'value': '?' },
        { 'name': 'Species with most secondary metabolite clusters', 'value': '?' },
        { 'name': 'NCBI taxon with most clusters', 'value': '?' },
        { 'name': 'Clusters in top taxon', 'value': '?' },
        { 'name': 'Genomes', 'value': '?' },
        { 'name': 'Sequences', 'value': '?' },
        { 'name': 'NCBI taxon with most sequences', 'value': '?' },
        { 'name': 'Sequences in top taxon', 'value': '?' },

      ];
      vm.sec_met_clusters = [];


      $http.get('/api/v1.0/stats').then(function(response){
        vm.general_stats = [
          {'name': 'Secondary metabolite clusters', 'value': response.data.num_clusters},
          {'name': 'Species with most secondary metabolite clusters', 'value': response.data.top_secmet_species},
          {'name': 'NCBI taxon with most clusters', 'value': response.data.top_secmet_taxon},
          {'name': 'Clusters in top taxon', 'value': response.data.top_secmet_taxon_count},
          {'name': 'Genomes', 'value': response.data.num_genomes},
          {'name': 'Sequences', 'value': response.data.num_sequences},
          {'name': 'NCBI taxon with most sequences', 'value': response.data.top_seq_taxon},
          {'name': 'Sequences in top taxon', 'value': response.data.top_seq_taxon_count},

        ];
        vm.sec_met_clusters = response.data.clusters;
      })
    }]);

})();

'use strict';

(function () {

  var app = angular.module('antismash.db.ui.stats', [

  ]);

  app.controller('StatsController', ['$http',
    function ($http) {

      var vm = this;
      vm.general_stats = {
        'num_clusters': '?',
        'top_secmet_species': '?',
        'top_secmet_taxon': '?',
        'top_secmet_taxon_count': '?',
        'num_genomes': '?',
        'num_sequences': '?',
        'top_seq_taxon': '?',
        'top_seq_taxon_count': '?'
      };
      vm.sec_met_clusters = [];


      $http.get('/api/v1.0/stats').then(function(response){
        vm.general_stats = {
          'num_clusters': response.data.num_clusters,
          'top_secmet_species': response.data.top_secmet_species,
          'top_secmet_taxon': response.data.top_secmet_taxon,
          'top_secmet_taxon_count': response.data.top_secmet_taxon_count,
          'num_genomes': response.data.num_genomes,
          'num_sequences': response.data.num_sequences,
          'top_seq_taxon': response.data.top_seq_taxon,
          'top_seq_taxon_count': response.data.top_seq_taxon_count
        };
        vm.sec_met_clusters = response.data.clusters;
      })
    }]);

})();

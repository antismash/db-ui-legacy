'use strict';

(function () {

  var app = angular.module('antismash.db.ui.stats', [

  ]);

  app.controller('StatsController', ['$http', '$state',
    function ($http, $state) {

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
      vm.queryTopSpecies = queryTopSpecies;

      function queryTopSpecies() {
        $state.go('query', {search_string: '[taxid]' + vm.general_stats.top_seq_taxon});
      }

      $http.get('/api/v1.0/stats').then(function(response){
        vm.general_stats = {
          'num_clusters': response.data.num_clusters,
          'top_secmet_species': response.data.top_secmet_species,
          'top_secmet_taxon': response.data.top_secmet_taxon,
          'top_secmet_taxon_count': response.data.top_secmet_taxon_count,
          'top_secmet_acc': response.data.top_secmet_acc,
          'num_genomes': response.data.num_genomes,
          'num_sequences': response.data.num_sequences,
          'top_seq_taxon': response.data.top_seq_taxon,
          'top_seq_taxon_count': response.data.top_seq_taxon_count,
          'top_seq_species': response.data.top_seq_species.replace(/Unclassified/, 'sp.'),
        };
        vm.sec_met_clusters = response.data.clusters;
      })
    }]);



})();

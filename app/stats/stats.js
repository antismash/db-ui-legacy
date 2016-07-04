'use strict';

(function () {

  var app = angular.module('antismash.db.ui.stats', [

  ]);

  app.controller('StatsController', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {

      var vm = this;
      $http.get('/api/v1.0/stats').then(function(response){
        vm.general_stats = [
          {'name': 'Secondary Metabolite Clusters', 'value': response.data.num_clusters},
          {'name': 'Genomes', 'value': response.data.num_genomes}
        ];
        vm.sec_met_clusters = response.data.clusters;
      })
    }]);

})();

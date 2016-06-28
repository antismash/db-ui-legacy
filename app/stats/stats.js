'use strict';

(function () {

  var app = angular.module('antismash.db.ui.stats', [

  ]);

  app.controller('StatsController', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {

      var vm = this;
      $http.get('/api/v1.0/stats').then(function(response){
        vm.num_clusters = response.data.num_clusters;
        vm.num_genomes = response.data.num_genomes;
        vm.sec_met_clusters = response.data.clusters;
      })
    }]);

})();

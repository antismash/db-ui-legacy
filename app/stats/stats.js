'use strict';

(function () {

  var app = angular.module('antismash.db.ui.stats', [

  ]);

  app.controller('StatsController', ['$scope', '$state',
    function ($scope, $state) {

      var vm = this;
      vm.sec_met_clusters = [
        {name: 'nrps', description: 'NRPS', count: 4},
        {name: 't1pks', description: 'Type I PKS', count: 4},
        {name: 't2pks', description: 'Type II PKS', count: 2},
        {name: 't3pks', description: 'Type III PKS', count: 1},
        {name: 'transatpks', description: 'Trans-AT PKS', count: 0},
        {name: 't4pks', description: 'Other KS', count: 2},
        {name: 'terpene', description: 'Terpene', count: 4},
        {name: 'lantipeptide', description: 'Lanthipeptide', count: 3},
        {name: 'bacteriocin', description: 'Bacteriocin', count: 2},
        {name: 'ectoine', description: 'Ectoine', count: 1},
        {name: 'melanin', description: 'Melanin', count: 1},
        {name: 'siderophore', description: 'Siderophore', count: 3},
        {name: 'butyrolactone', description: 'Butyrolactone', count: 1}
      ]

    }]);

})();

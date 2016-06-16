'use strict';

(function () {

  var app = angular.module('antismash.db.ui.browse', [

  ]);

  app.controller('BrowseController', ['$scope', '$state',
    function ($scope, $state) {

      var vm = this;
      vm.sec_met_types = [
        'NRPS',
        'Type I PKS',
        'Type II PKS',
        'Type III PKS',
        'Trans AT PKS',
        'Other KS'
      ]

    }]);

  app.
    component('browseSecmet', {
      templateUrl: 'browse/browse.secmet.html',
      bindings: {
        types: '<'
      }
    }).
    component('browseTaxonomy', {
      templateUrl: 'browse/browse.taxonomy.html'
    });

})();

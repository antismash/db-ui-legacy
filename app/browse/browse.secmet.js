'use strict';

(function () {

  var app = angular.module('antismash.db.ui.browse.secmet', [
    'jsTree.directive'
  ]);

  app.controller('BrowseSecmetController', ['$scope', '$state',
    function ($scope, $state) {
      var vm = this;
      $scope.activate_cb = activate_cb;
      $scope.tree_types = {
        default: {
          icon: "fa fa-database"
        },
        cluster: {
          icon: "fa fa-exchange"
        }
      };
      $scope.tree = [
        {
          "id": "nrps",
          "parent": "#",
          "text": "NRPS",
          state: {
            disabled: true
          }
        },
        {
          "id": "t1pks",
          "parent": "#",
          "text": "Type I PKS",
          state: {
            disabled: true
          }
        },
        {
          "id": "nc_003888_c10",
          "parent": "nrps",
          "text": "NC_003888 Cluster 10",
          "type": "cluster"
        }
      ];

      function activate_cb(event, node) {
        console.log("clicked node ", node);
      }
    }]);

})();

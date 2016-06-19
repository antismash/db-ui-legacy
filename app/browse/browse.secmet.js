'use strict';

(function () {

  var app = angular.module('antismash.db.ui.browse.secmet', [
    'jsTree.directive',
    'antismash.db.ui.cluster'
  ]);

  app.controller('BrowseSecmetController', ['$scope', '$state',
    function ($scope, $state) {
      var vm = this;

      vm.active = "none";

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
          id: "lantipeptide",
          parent: "#",
          text: "Lanthipeptide",
          state: {
            disabled: true,
          }
        },
        {
          id: "nc_003888_c3",
          parent: "lantipeptide",
          text: "NC_003888 Cluster 3",
          type: "cluster"
        },
        {
          "id": "nc_003888_c10",
          "parent": "nrps",
          "text": "NC_003888 Cluster 10",
          "type": "cluster"
        }
      ];

      function activate_cb(event, ctx) {
        // Wrap in $apply so angular notices stuff changed.
        $scope.$apply(function(){
          vm.active = ctx.node.id;
        })
      }
    }]);

})();

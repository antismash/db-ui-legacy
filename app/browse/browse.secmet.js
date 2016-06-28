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

      function activate_cb(event, ctx) {
        // Wrap in $apply so angular notices stuff changed.
        $scope.$apply(function(){
          vm.active = ctx.node.id;
        })
      }
    }]);

})();

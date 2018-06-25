'use strict';

(function () {

  var app = angular.module('antismash.db.ui.browse.secmet', [
    'jsTree.directive'
  ]);

  app.controller('BrowseSecmetController', ['$scope', '$window',
    function ($scope, $window) {
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
          var assembly_id = ctx.node.original.assembly_id;
          var cluster = ctx.node.original.cluster_number;
          var url = '/output/' + assembly_id + '/index.html#cluster-' + cluster;
          $window.open(url, '_new');
        })
      }
    }]);

})();

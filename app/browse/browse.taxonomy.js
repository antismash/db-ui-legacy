'use strict';

(function () {

  var app = angular.module('antismash.db.ui.browse.taxonomy', [
    'jsTree.directive'
  ]);

  app.controller('BrowseTaxonomyController', ['$scope', '$state',
    function ($scope, $state) {
      var vm = this;
      vm.active = null;
      $scope.activate_cb = activate_cb;
      $scope.tree_types = {
        default: {
          icon: "fa fa-sitemap"
        },
        strain: {
          icon: "fa fa-circle-o"
        }
      };

      function activate_cb(event, ctx) {
        // Wrap in $apply so angular notices stuff changed.
        $scope.$apply(function(){
          vm.active = ctx.node.id;
          $scope.$broadcast('genomeSelected', ctx.node.id);
        })
      }
    }]);

})();

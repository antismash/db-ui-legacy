'use strict';

(function () {

  var app = angular.module('antismash.db.ui.browse.taxonomy', [
    'jsTree.directive'
  ]);

  app.controller('BrowseTaxonomyController', ['$scope', '$state',
    function ($scope, $state) {
      var vm = this;
      $scope.activate_cb = activate_cb;
      $scope.tree_types = {
        default: {
          icon: "fa fa-sitemap"
        },
        strain: {
          icon: "fa fa-circle-o"
        }
      };
      $scope.tree = [
        {
          id: "bacteria",
          parent: "#",
          text: "Bacteria",
          state: {
            disabled: true
          }
        },
        {
          id: "fungi",
          parent: "#",
          text: "Fungi",
          state: {
            disabled: true
          }
        },
        {
          id: "actinobacteria",
          parent: "bacteria",
          text: "Actinobacteria",
          state: {
            disabled: true
          }
        },
        {
          id: "actinomycetales",
          parent: "actinobacteria",
          text: "Actinomycetales",
          state: {
            disabled: true
          }
        },
        {
          id: "streptomycetaceae",
          parent: "actinomycetales",
          text: "Streptomycetaceae",
          state: {
            disabled: true
          }
        },
        {
          id: "streptomyces",
          parent: "streptomycetaceae",
          text: "Streptomyces",
          state: {
            disabled: true
          }
        },
        {
          id: "streptomyces_coelicolor",
          parent: "streptomyces",
          text: "Steptomyces coelicolor",
          type: "strain"
        }
      ];

      function activate_cb(event, node) {
        console.log("clicked node ", node);
      }
    }]);

})();

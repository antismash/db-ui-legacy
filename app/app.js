'use strict';

(function () {
  var app = angular.module('antismashDbUi', [
    'ngMaterial',
    'ui.router'
  ]);

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$mdThemingProvider',
    function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {


      $urlRouterProvider.otherwise('/query');

      $stateProvider.
        state('query', {
          url: '/query',
          template: '<p>Query antiSMASH DB</p>'
        }).
        state('browse',{
          url: '/browse',
          template: '<p>Browse antiSMASH DB</p>'
        });

      $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('grey')
        .warnPalette('orange');
    }]);

  app.controller('MainController', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    }
  })

})();

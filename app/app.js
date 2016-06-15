'use strict';

(function () {
  var app = angular.module('antismash.db.ui', [
    'ui.bootstrap',
    'ui.router',
    'antismash.db.ui.query'
  ]);

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {


      $urlRouterProvider.otherwise('/start');

      $stateProvider.
        state('start', {
          url: '/start',
          templateUrl: 'start/start.html'
        }).
        state('stats', {
          url: '/stats',
          templateUrl: 'stats/stats.html'
        }).
        state('query', {
          url: '/query',
          templateUrl: 'query/query.html',
          controller: 'QueryController',
          controllerAs: '$ctrl'
        }).
        state('browse', {
          url: '/browse',
          templateUrl: 'browse/browse.html'
        }).
        state('help', {
          url: '/help',
          templateUrl: 'help/help.html'
        });

    }]);

})();

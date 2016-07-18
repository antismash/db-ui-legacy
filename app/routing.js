angular.module('antismash.db.ui.routing', [
  'ui.router',
  'antismash.db.ui.query',
  'antismash.db.ui.stats',
  'antismash.db.ui.browse',
  'antismash.db.ui.cluster',
  'antismash.db.ui.genome',
]).config([
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
        templateUrl: 'stats/stats.html',
        controller: 'StatsController',
        controllerAs: '$ctrl'
      }).
      state('query', {
        url: '/query',
        templateUrl: 'query/query.html',
        controller: 'QueryController',
        controllerAs: 'ctrl'
      }).
      state('browse', {
        url: '/browse',
        templateUrl: 'browse/browse.html',
        controller: 'BrowseController',
        controllerAs: '$ctrl'
      }).
      state('show', {
        url: '/show',
        abstract: true,
        template: '<ui-view/>'
      }).
      state('show.cluster', {
        url: '/cluster/:id',
        template: '<as-cluster cluster-id="{{ctrl.id}}"></as-cluster>',
        controller: function ($stateParams) {
          this.id = $stateParams.id;
        },
        controllerAs: 'ctrl'
      }).
      state('show.genome', {
        url: '/genome/:id',
        template: '<as-genome genome-id="{{ctrl.id}}"></as-genome>',
        controller: function ($stateParams) {
          this.id = $stateParams.id;
        },
        controllerAs: 'ctrl'
      }).
      state('help', {
        url: '/help',
        templateUrl: 'help/help.html'
      });

  }]);

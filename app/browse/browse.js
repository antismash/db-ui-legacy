'use strict';

(function () {

  var app = angular.module('antismash.db.ui.browse', [
    'antismash.db.ui.browse.secmet',
    'antismash.db.ui.browse.taxonomy'
  ]);

  app.
    component('browseSecmet', {
      templateUrl: 'browse/browse.secmet.html',
      controller: 'BrowseSecmetController',
      controllerAs: '$ctrl'
    }).
    component('browseTaxonomy', {
      templateUrl: 'browse/browse.taxonomy.html',
      controller: 'BrowseTaxonomyController',
      controllerAs: '$ctrl'
    });

})();

'use strict';

(function () {

  var app = angular.module('antismash.db.ui.query', [

  ]);

  app.controller('QueryController', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {

      var vm = this;

      vm.search_string = '';
      vm.search = search;

      vm.results = [];

      function search() {
        $http.post('/api/v1.0/search', {search_string: vm.search_string}).then(
          function(results){
            vm.results = results.data;
          }
        )
      }

    }]);

})();

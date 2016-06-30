'use strict';

(function () {

  var app = angular.module('antismash.db.ui.query', [

  ]);

  app.controller('QueryController', ['$scope', '$state',
    function ($scope, $state) {

      var vm = this;

      vm.search_string = '';

      vm.search = search;

      function search() {
        console.log("Searching for '" + vm.search_string + "'");
      }

    }]);

})();

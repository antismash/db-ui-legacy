'use strict'

angular.module('antismash.db.ui.cluster', [
  'antismash.db.ui.cluster.description'
])
  .controller('ClusterCtrl', function ($scope, ClusterSvc) {
    var vm = this;
  })
  .factory('ClusterSvc', function ($http) {
    return {};
  })
  .directive('asCluster', function () {
    return {
      scope: {},
      bindToController: {
        clusterId: "@"
      },
      templateUrl: 'cluster/cluster.html',
      controller: 'ClusterCtrl',
      controllerAs: 'ctrl'
    }
  });

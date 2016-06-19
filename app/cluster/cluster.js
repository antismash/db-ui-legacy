'use strict'

angular.module('antismash.db.ui.cluster', [])
  .controller('ClusterCtrl', function ($scope, ClusterSvc){
    var vm = this;
    vm.cluster = function() {
      return ClusterSvc.getCluster(vm.clusterId);
    }
  })
  .service('ClusterSvc', function(){
    var invalidCluster = {
      type: 'invalid',
      id: 'invalid',
      start: 123,
      end: 456,
      orfs: []
    };
    this.currentCluster = invalidCluster;
    this.getCluster = getCluster;

    function getCluster(clusterId){
      var cluster = {
        id: clusterId
      };
      switch (clusterId) {
        case 'nc_003888_c10':
          cluster.type = 'NRPS';
          cluster.start = 1234567;
          cluster.end = 2345678;
          cluster.orfs = [];
          break;
        case 'nc_003888_c3':
          cluster.type = 'lantipeptide';
          cluster.start = 123456;
          cluster.end = 234567;
          cluster.orfs = [];
          break;
        default:
          cluster = invalidCluster;
          break;
      }
      this.currentCluster = cluster;
      return cluster;
    }
  })
  .directive('asCluster', function() {
    return {
      scope: {},
      bindToController: {
        clusterId: "@"
      },
      template: '<div>{{ctrl.cluster().id}}: {{ctrl.cluster().type}}</div>',
      controller: 'ClusterCtrl',
      controllerAs: 'ctrl'
    }
  });

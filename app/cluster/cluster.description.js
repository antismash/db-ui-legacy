'use strict'

angular.module('antismash.db.ui.cluster.description', [
  'toggle-switch'
])
  .controller('ClusterDescriptionCtrl', function ($log) {
    var vm = this;
    vm.showRules = false;
    var cluster = {
      start: vm.clusterData.start,
      end: vm.clusterData.end,
      idx: 1,
      orfs: vm.clusterData.orfs,
    }
    //svgene.drawClusters('cluster-detail-svg', [cluster], 30, 800);
  })
  .directive('asClusterDescription', function () {
    return {
      scope: {},
      bindToController: {
        clusterData: "<"
      },
      templateUrl: 'cluster/cluster.description.html',
      controller: 'ClusterDescriptionCtrl',
      controllerAs: 'ctrl'
    }
  });

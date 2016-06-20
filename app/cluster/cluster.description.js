'use strict'

angular.module('antismash.db.ui.cluster.description', [
  'toggle-switch'
])
  .controller('ClusterDescriptionCtrl', function ($log) {
    var vm = this;
    vm.showRules = false;
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

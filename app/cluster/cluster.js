'use strict'

angular.module('antismash.db.ui.cluster', [
  'antismash.db.ui.cluster.description'
])
  .controller('ClusterCtrl', function ($scope, ClusterSvc) {
    var vm = this;
    vm.cluster = function () {
      vm.currentCluster = ClusterSvc.getCluster(vm.clusterId);
      return vm.currentCluster;
    }
    vm.cluster();
  })
  .service('ClusterSvc', function () {
    this.currentCluster = null;
    this.getCluster = getCluster;

    var clusters = {
      'nc_003888_c3': {
        id: 'nc_003888_c3',
        description: 'NC_003888 Cluster 3',
        type: 'lantipeptide',
        start: 12345,
        end: 23456,
        orfs: [],
        details: {
          leader: "MEHFNLDPR",
          core: "ASTDHCSAAAGTCGGCA",
          class: "I",
          score: -8.07,
          mi_mass: 2328.1,
          mw: 2329.6,
          bridges: 3,
          alt_weights: [
            2347.6,
            2365.6,
            2383.7,
            2401.7
          ]
        },
        detection_rules: "lantipeptide: LanB and LanC, or LanM, or LanK"
      },
      'nc_003888_c10': {
        id: 'nc_003888_c10',
        description: 'NC_003888 Cluster 10',
        type: 'NRPS',
        start: 1234567,
        end: 2345678,
        orfs: [],
        details: {
          monomers: [
            ['ser', 'thr', 'trp', 'asp', 'asp', 'hpg'],
            ['asp', 'gly', 'asn'],
            ['nrp', 'trp']
          ],
          predictions: [
            {
              id: 'SCO3230',
              domains: [
                {
                  nrpspredictor: 'ser',
                  stachelhaus: 'ser',
                  minowa: 'ser',
                  consensus: 'ser'
                }
              ]
            },
            {
              id: 'SCO3231',
              domains: [
                {
                  nrpspredictor: 'asp',
                  stachelhaus: 'asp',
                  minowa: 'asp',
                  consensus: 'asp'
                }
              ]
            }
          ] //predictions
        }, //details
        detection_rules: "nrps: A and T and PCP"
      }
    };

    function getCluster(clusterId) {
      if (!this.currentCluster || clusterId != this.currentCluster.id) {
        this.currentCluster = clusters[clusterId];
      }
      return this.currentCluster;
    }
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

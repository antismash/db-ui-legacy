'use strict'

angular.module('antismash.db.ui.genome', [])
  .controller('GenomeCtrl', function ($scope, GenomeSvc) {
    var vm = this;
    vm.genome = function () {
      vm.currentGenome = GenomeSvc.getGenome(vm.genomeId);
      return vm.currentGenome;
    }
    vm.genome();
  })
  .service('GenomeSvc', function () {
    this.currentGenome = null;
    this.getGenome = getGenome;

    var genomes = {
      'nc_003888': {
        id: 'nc_003888',
        clusters: []
      },
      'nc_017486': {
        id: 'nc_017486',
        clusters: []
      }
    };

    function getGenome(genomeId) {
      if (!this.currentGenome || genomeId != this.currentGenome.id) {
        this.currentGenome = genomes[genomeId];
      }
      return this.currentGenome;
    }
  })
  .directive('asGenome', function () {
    return {
      scope: {},
      bindToController: {
        genomeId: "@"
      },
      templateUrl: 'genome/genome.html',
      controller: 'GenomeCtrl',
      controllerAs: 'ctrl'
    }
  });

'use strict'

angular.module('antismash.db.ui.genome', [])
  .controller('GenomeCtrl', ['$scope', '$window', 'GenomeSvc',
    function ($scope, $window, GenomeSvc) {
    var vm = this;
    vm.currentGenome = null;
    vm.getMibigUrl = getMibigUrl;
    vm.showCluster = showCluster;
    vm.loadGenome = loadGenome;
    vm.pending = false;

    if (vm.genomeId){
      loadGenome(vm.genomeId);
    }

    $scope.$on("genomeSelected", function(event, args){
      if (vm.currentGenome &&
          vm.currentGenome.length > 0 &&
          vm.currentGenome[0].acc.toLowerCase() == args.toLowerCase()){
        return;
      }
      loadGenome(args);
    })

    function showCluster(entry) {
      var cluster_acc = entry.acc + '_c' + entry.cluster_number;
      $window.open('/output/' + entry.acc + '/index.html#cluster-' + entry.cluster_number, '_new');
    };

    function getMibigUrl(accession) {
      if (!accession) {
        return '';
      }
      var acc = accession.split(/_/)[0];
      return "http://mibig.secondarymetabolites.org/repository/" + acc + "/index.html#cluster-1";
    };

    function loadGenome(genome_id) {
      vm.pending = true;
      vm.currentGenome = null;
      GenomeSvc.getGenome(genome_id).then(
        function (result) {
          vm.pending = false;
          vm.currentGenome = result.data;
        }
      );
    };
  }])
  .factory('GenomeSvc', function ($http) {
    var getGenome = function(genomeId) {
      return $http.get('/api/v1.0/genome/' + genomeId);
    };

    return {
      getGenome: getGenome
    };
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

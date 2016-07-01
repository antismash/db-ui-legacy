'use strict'

angular.module('antismash.db.ui.genome', [])
  .controller('GenomeCtrl', function ($scope, GenomeSvc) {
    var vm = this;
    vm.currentGenome = null;
    vm.getMibigUrl = getMibigUrl;
    vm.showCluster = showCluster;

    if (vm.genomeId){
      GenomeSvc.getGenome(vm.genomeId).then(
        function (result) {
          vm.currentGenome = result.data;
        }
      );
    }

    $scope.$on("genomeSelected", function(event, args){
      GenomeSvc.getGenome(args).then(function(result){
        vm.currentGenome = result.data;
      })
    })

    function showCluster(entry) {
      var cluster_acc = entry.acc + '_c' + entry.cluster_number;
      window.open('/output/' + entry.acc + '/index.html#cluster-' + entry.cluster_number, '_new');
      //$state.go('show.cluster', {id: cluster_acc});
    };

    function getMibigUrl(accession) {
      if (!accession) {
        return '';
      }
      var acc = accession.split(/_/)[0];
      return "http://mibig.secondarymetabolites.org/repository/" + acc + "/index.html#cluster-1";
    };
  })
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

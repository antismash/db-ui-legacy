describe('StatsController', function () {
  beforeEach(function () {
    module('antismash.db.ui.stats');
  });

  var $httpBackend;
  var createController;
  var ctrl;

  beforeEach(function () {
    inject(function ($injector) {

      var $controller = $injector.get('$controller');
      $httpBackend = $injector.get('$httpBackend');

      createController = function () {
        return $controller('StatsController');
      }

    });
  });

  it('should be defined', function () {
    ctrl = createController();
    expect(ctrl).toBeDefined();
  });

  it('should query for stats', function () {
    $httpBackend.expectGET('/api/v1.0/stats').respond({
      clusters: [{count: 1, id: 'nrps', description: 'Nonribosomal peptide'}],
      num_clusters: 1,
      top_secmet_species: 'E. xample',
      top_secmet_taxon: 1234,
      top_secmet_taxon_count: 1,
      num_genomes: 1,
      num_sequences: 1,
      top_seq_taxon: 1234,
      top_seq_taxon_count: 1
    });
    ctrl = createController();
    $httpBackend.flush();
    expect(ctrl.sec_met_clusters).toEqual([{count: 1, id: 'nrps', description: 'Nonribosomal peptide'}]);
  });

});

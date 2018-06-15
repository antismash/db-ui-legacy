'use strict';

/* Controller */
describe('GenomeCtrl', function () {
  var $q;
  var $rootScope;
  var $scope;
  var $window;
  var ctrl;
  var GenomeSvc;
  var getController;

  var data = [
    {
      acc: 'fake1234',
      cluster_number: 1,
      description: 'fake',
      start_pos: 1234,
      end_pos: 2345,
      cbh_description: 'fake clusterblast hit',
      cbh_acc: 'fake12345',
      similarity: 77
    }
  ];

  beforeEach(function () {
    module('antismash.db.ui.genome');

    $window = { open: jasmine.createSpy() };

    module(function ($provide) {
      /* Fake out the GenomeSvc */
      $provide.value('GenomeSvc', {
        getGenome: function () {
          return {
            then: function (callback) {
              return callback({
                data: data
              });
            }
          };
        }
      });

      $provide.value('$window', $window);
    });
  });


  beforeEach(function () {
    inject(function ($injector) {
      var $controller = $injector.get('$controller');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $q = $injector.get('$q');
      GenomeSvc = $injector.get('GenomeSvc');

      getController = function (_bind) {
        var bind = _bind || {};
        var ctrl = $controller('GenomeCtrl', {
          $scope: $scope, GenomeSvc: GenomeSvc
        }, bind);
        ctrl.$onInit();
        return ctrl;
      };
    });
  });

  it('should be defined', function () {
    ctrl = getController();
    expect(ctrl).toBeDefined();
  });

  it('should call the GenomeSvc when initialized with an ID', function () {
    spyOn(GenomeSvc, 'getGenome').and.callThrough();
    ctrl = getController({ genomeId: 'fake1234' });
    expect(GenomeSvc.getGenome).toHaveBeenCalledWith('fake1234');
  });

  describe('loadGenome', function () {
    it('should call GenomeSvc', function () {
      spyOn(GenomeSvc, 'getGenome').and.callThrough();
      ctrl = getController();
      ctrl.loadGenome('fake1234');
      expect(GenomeSvc.getGenome).toHaveBeenCalledWith('fake1234');
    });

    it('should set "pending" to true only while call is ongoing', function () {
      var deferred = $q.defer();
      spyOn(GenomeSvc, 'getGenome').and.returnValue(deferred.promise);
      ctrl = getController();

      // First pending is false
      expect(ctrl.pending).toBe(false);

      // While waiting for the promise to resolve, pending is true
      ctrl.loadGenome('fake1234');
      expect(ctrl.pending).toBe(true);

      // Now resolve the promise, pending is false again
      deferred.resolve({data: data});
      $scope.$apply();
      expect(ctrl.pending).toBe(false);
    });

    it('should clear the old genome when called', function () {
      var deferred = $q.defer();
      spyOn(GenomeSvc, 'getGenome').and.returnValue(deferred.promise);
      ctrl = getController();
      ctrl.currentGenome = data;

       // While waiting for the promise to resolve, currentGenome should be deleted already
      ctrl.loadGenome('fake1234');
      expect(ctrl.currentGenome).toEqual(null);

      // Now resolve the promise, currentGenome should be filled again
      deferred.resolve({data: data});
      $scope.$digest();
      expect(ctrl.currentGenome).toEqual(data);
    });
  });

  describe('showCluster', function () {
    it('should open the cluster in a new window', function () {
      ctrl = getController();
      ctrl.showCluster({ acc: 'fake1234', cluster_number: 23 });
      expect($window.open).toHaveBeenCalledWith('/output/fake1234/index.html#cluster-23', '_blank');
    });
  });

  describe('getMibigUrl', function () {
    it('should return an empty string on an empty accession', function () {
      ctrl = getController();
      expect(ctrl.getMibigUrl(null)).toEqual('');
    });

    it('should retun the correct URL given an accession', function () {
      ctrl = getController();
      expect(ctrl.getMibigUrl('fake1234_c2')).toEqual('http://mibig.secondarymetabolites.org/repository/fake1234/index.html#cluster-1');
    });
  });

  describe('genomeSelected event handler', function () {
    beforeEach(function () {
      ctrl = getController();
      spyOn(GenomeSvc, 'getGenome').and.callThrough();
    });

    it('should call loadGenome', function () {
      $scope.$apply(function () {
        $rootScope.$broadcast('genomeSelected', 'fake1234');
      });
      expect(GenomeSvc.getGenome).toHaveBeenCalledWith('fake1234');
    });

    it('should not call loadGenome when the current genome is the new genome', function () {
      ctrl.currentGenome = data;
      $scope.$apply(function () {
        $rootScope.$broadcast('genomeSelected', 'fake1234');
      });
      expect(GenomeSvc.getGenome).not.toHaveBeenCalled();
    });
  });
});


/* Service */
describe('GenomeSvc', function () {
  var $httpBackend;

  beforeEach(function () {
    module('antismash.db.ui.genome');
    inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
    });
  });

  it('should be defined', inject(function (GenomeSvc) {
    expect(GenomeSvc).toBeDefined();
  }));

  it('should call out to the API server', inject(function (GenomeSvc) {
    $httpBackend.expectGET('/api/v1.0/genome/fake1234').respond([]);
    GenomeSvc.getGenome('fake1234').then(function (result) {
      expect(result.data).toEqual([]);
    });
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));
});


/* Directive */
describe('asGenome', function () {
  var $httpBackend;
  var $scope;
  var element;

  beforeEach(function () {
    module('antismash.db.ui.genome');
    inject(function ($rootScope, $compile, _$httpBackend_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('genome/genome.html').respond('<div>asGenome loaded</div>');
      element = $compile('<as-genome></as-genome>')($scope);
      $scope.$digest();
      $httpBackend.flush();
    })
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  })

  it('should load the template', function () {
    expect(element.text()).toEqual('asGenome loaded');
  });
});

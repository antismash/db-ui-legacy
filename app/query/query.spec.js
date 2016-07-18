describe('QueryController', function () {
  beforeEach(function () {
    module('antismash.db.ui.query');
  });

  var $httpBackend;
  var createController;
  var $window;
  var ctrl;

  beforeEach(function () {
    $window = { open: jasmine.createSpy() };

    module(function ($provide) {
      $provide.value('$window', $window);
    });

    inject(function ($injector) {

      var $controller = $injector.get('$controller');
      $httpBackend = $injector.get('$httpBackend');

      createController = function () {
        return $controller('QueryController');
      }

    });

    ctrl = createController();
  });

  it('should be defined', function () {
    var ctrl = createController();
    expect(ctrl).toBeDefined();
  });


  describe('search functions', function () {
    var searchHandler;
    beforeEach(function () {
      searchHandler = $httpBackend.when('POST', '/api/v1.0/search')
        .respond({
          clusters: [{
            acc: 'fake'
          }],
          total: 1,
          offset: 0,
          paginate: 5
        });
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('simple search', function () {
      it('should fetch the results', function () {
        $httpBackend.expectPOST('/api/v1.0/search', { search_string: '[type]fake' });
        ctrl.search_string = '[type]fake';
        ctrl.simpleSearch();
        expect(ctrl.search_pending).toBe(true);
        $httpBackend.flush();
        expect(ctrl.search_pending).toBe(false);
        expect(ctrl.search_done).toBe(true);
        expect(ctrl.results.clusters.length).toBe(1);
      });
    });

    describe('search', function () {
      it('should build the correct query', function () {
        $httpBackend.expectPOST('/api/v1.0/search', { search_string: '[type]fake' });
        ctrl.search_objects = [{ category: { val: 'type', desc: 'BGC type' }, term: 'fake' }];
        ctrl.search();
        $httpBackend.flush();
      });

      it('should not trigger a search on empty search_objects', function () {
        ctrl.search_objects = [];
        ctrl.search();
        /* This would throw an error for "unflushed request" if search() did trigger a request */
      });

      it('should not include a search_object with an empty term', function () {
        $httpBackend.expectPOST('/api/v1.0/search', { search_string: '[type]fake' });
        ctrl.search_objects = [
          { category: { val: 'type', desc: 'BGC type' }, term: 'fake' },
          { category: { val: 'monomer', desc: 'Monomer' }, term: '' }
        ];
        ctrl.search();
        $httpBackend.flush();
      });
    });


    describe('loadMore', function () {
      it('should load more data', function () {
        $httpBackend.expectPOST('/api/v1.0/search', {search_string: '[type]fake', offset: 2});
        ctrl.search_string = "[type]fake";
        ctrl.results = {clusters: [], offset: 1, paginate:1};
        ctrl.loadMore();
        expect(ctrl.loading_more).toBe(true);
        $httpBackend.flush();
        expect(ctrl.loading_more).toBe(false);
        expect(ctrl.results.clusters.length).toBe(1);
      });
    });
  });


  describe('canLoadMore', function () {
    it('returns false when no results are loaded', function () {
      var result = ctrl.canLoadMore();
      expect(result).toBe(false);
    });

    it('returns false when no more results can be loaded', function () {
      ctrl.results = {
        total: 1,
        clusters: [{ id: 'fake' }]
      };
      var result = ctrl.canLoadMore();
      expect(result).toBe(false);
    });

    it('returns true when more results can be loaded', function () {
      ctrl.results = {
        total: 2,
        clusters: [{ id: 'fake' }]
      };
      var result = ctrl.canLoadMore();
      expect(result).toBe(true);
    });
  });


  describe('showCluster', function () {
    it('should open the correct URL', function () {
      ctrl.showCluster({ acc: 'ABC1234', cluster_number: 23 });
      expect($window.open).toHaveBeenCalledWith('/output/ABC1234/index.html#cluster-23', '_new');
    });
  });


  describe('getMibigUrl', function () {
    it("should return an empty string when there's no accession", function () {
      expect(ctrl.getMibigUrl(null)).toBe('');
    });

    it('should return the proper MIBiG link when there is an accession', function () {
      expect(ctrl.getMibigUrl('BGC123456_c1')).toBe('http://mibig.secondarymetabolites.org/repository/BGC123456/index.html#cluster-1');
    });
  });


  describe('getNcbiUrl', function () {
    it("should return an empty string when there's no accession", function () {
      expect(ctrl.getNcbiUrl(null)).toBe('');
    });

    it('should return the proper NCBI link when there is an accession', function () {
      expect(ctrl.getNcbiUrl('ABC1234')).toBe('http://www.ncbi.nlm.nih.gov/genome/?term=ABC1234');
    })
  });


  describe('addEntry', function () {
    it('should add the correct search entry', function () {
      expect(ctrl.search_objects).toEqual([{ category: { val: 'type', desc: 'BGC type' }, term: '' }]);
      ctrl.addEntry();
      expect(ctrl.search_objects).toEqual([
        { category: { val: 'type', desc: 'BGC type' }, term: '' },
        { category: { val: 'type', desc: 'BGC type' }, term: '' }
      ]);
    });
  });


  describe('removeEntry', function () {
    it('should remove an existing entry', function () {
      ctrl.removeEntry(ctrl.search_objects[0]);
      expect(ctrl.search_objects.length).toBe(0);
    });

    it('should ignore nonexistent objects to remove', function () {
      ctrl.removeEntry({ id: 'fake' });
      expect(ctrl.search_objects.length).toBe(1);
    })
  });


  describe('loadExample', function () {
    it('should replace the search_objects', function () {
      ctrl.loadExample();
      expect(ctrl.search_objects).toEqual([
        {
          category: { val: 'type', desc: 'BGC type' },
          term: 'lantipeptide'
        },
        {
          category: { val: 'genus', desc: 'Genus' },
          term: 'Streptomyces'
        }
      ]);
    });

    it('should set the search_string', function () {
      ctrl.loadExample();
      expect(ctrl.search_string).toEqual('lantipeptide Streptomyces');
    })
  });


  describe('resetSearch', function () {
    it('should clear out the results', function () {
      ctrl.results = { id: 'fake' };
      ctrl.resetSearch();
      expect(ctrl.results).toEqual({});
    });

    it('should set search_pending to false', function () {
      ctrl.search_pending = true;
      ctrl.resetSearch();
      expect(ctrl.search_pending).toBe(false);
    });

    it('should set search_done to false', function () {
      ctrl.search_done = true;
      ctrl.resetSearch();
      expect(ctrl.search_done).toBe(false);
    })
  });
});

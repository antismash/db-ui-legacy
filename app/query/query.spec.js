describe('QueryController', function () {
  beforeEach(function () {
    module('ui.router');
    module('antismash.db.ui.query');
  });

  var $httpBackend;
  var createController;
  var $window;
  var $stateParams;
  var Downloader;
  var bowser;
  var ctrl;

  beforeEach(function () {
    $window = { open: jasmine.createSpy() };
    bowser = {};

    module(function ($provide) {
      $provide.value('$window', $window);
      $provide.value('bowser', bowser);
    });

    inject(function ($injector) {

      var $controller = $injector.get('$controller');
      $httpBackend = $injector.get('$httpBackend');
      $stateParams = $injector.get('$stateParams');
      Downloader = $injector.get('Downloader');
      bowser = $injector.get('bowser');

      createController = function () {
        return $controller('QueryController', {
          '$window': $window,
          '$stateParams': $stateParams,
          'Downloader': Downloader,
          'bowser': bowser
        });
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
        var expected_query = {query: {search: 'cluster', return_type: 'json',
                              terms: {term_type: 'expr', category: 'type', term: 'fake'}}};
        $httpBackend.expectPOST('/api/v1.0/search', expected_query);
        ctrl.query = {search: 'cluster', return_type: 'json',
                      terms: {term_type: 'expr', category: 'type', term: 'fake'}}
        ctrl.search();
        $httpBackend.flush();
      });

      it('should not trigger a search on empty query', function () {
        ctrl.query = {search: 'cluster', return_type: 'json',
                      terms: {term_type: 'expr', category: '', term: ''}};
        ctrl.search();
        /* This would throw an error for "unflushed request" if search() did trigger a request */
      });
    });


    describe('loadMore', function () {
      it('should load more data on simple search', function () {
        $httpBackend.expectPOST('/api/v1.0/search', {search_string: '[type]fake', offset: 2});
        ctrl.search_string = "[type]fake";
        ctrl.ran_simple_search = true;
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
      expect($window.open).toHaveBeenCalledWith('/output/ABC1234/index.html#cluster-23', '_blank');
    });
  });


  describe('getMibigUrl', function () {
    it("should return an empty string when there's no accession", function () {
      expect(ctrl.getMibigUrl(null)).toBe('');
    });

    it('should return the proper MIBiG link when there is an accession', function () {
      expect(ctrl.getMibigUrl('BGC123456_c1')).toBe('https://mibig.secondarymetabolites.org/repository/BGC123456/index.html#cluster-1');
    });
  });


  describe('getNcbiUrl', function () {
    it("should return an empty string when there's no accession", function () {
      expect(ctrl.getNcbiUrl(null)).toBe('');
    });

    it('should return the proper NCBI link when there is an accession', function () {
      expect(ctrl.getNcbiUrl('ABC1234')).toBe('https://www.ncbi.nlm.nih.gov/genome/?term=ABC1234');
    })
  });


  describe('loadComplexExample', function () {
    it('should replace the search_objects', function () {
      ctrl.loadComplexExample();
      expect(ctrl.query).toEqual({
          search: 'cluster',
          return_type: 'json',
          terms: {
            term_type: 'op',
            operation: 'and',
            left: {
              term_type: 'expr',
              category: 'type',
              term: 'ripp'
            },
            right: {
              term_type: 'op',
              operation: 'or',
              left: {
                term_type: 'expr',
                category: 'genus',
                term: 'Streptomyces'
              },
              right: {
                term_type: 'expr',
                category: 'genus',
                term: 'Lactococcus'
              }
            }
          }
        });
    });
  });

  describe('loadSimpleExample', function() {
    it('should set the search_string', function () {
      ctrl.loadSimpleExample();
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

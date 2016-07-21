'use strict';
describe('BrowseTaxonomyController', function () {
  beforeEach(function () {
    module('antismash.db.ui.browse.taxonomy');
  });

  var $scope;
  var ctrl;

  beforeEach(function () {
    var $broadcast = jasmine.createSpy();

    inject(function ($injector) {
      var $controller = $injector.get('$controller');
      $scope = $injector.get('$rootScope').$new();
      $scope.$broadcast = $broadcast;

      ctrl = $controller('BrowseTaxonomyController', {
        $scope: $scope
      });
    });
  });

  it('should be defined', function () {
    expect(ctrl).toBeDefined();
  });

  describe('activate_cb', function () {
    it('should set ctrl.active to the node id', function () {
      $scope.activate_cb(null, { node: { id: 'fake1234' } });
      expect(ctrl.active).toEqual('fake1234');
    });

    it('should broadcast a "genomeSelected" event', function () {
      $scope.activate_cb(null, { node: { id: 'fake1234' } });
      expect($scope.$broadcast).toHaveBeenCalledWith('genomeSelected', 'fake1234');
    });
  });

});

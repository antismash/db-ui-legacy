'use strict';
describe('BrowseSecmetController', function () {
  beforeEach(function () {
    module('antismash.db.ui.browse.secmet');
  });

  var $scope;
  var $window;
  var ctrl;

  beforeEach(function () {

    $window = { open: jasmine.createSpy() };
    module(function ($provide) {
      $provide.value('$window', $window);
    });


    inject(function ($injector) {
      var $controller = $injector.get('$controller');
      $scope = $injector.get('$rootScope').$new();

      ctrl = $controller('BrowseSecmetController', {
        $scope: $scope, $window: $window
      });
    });
  });

  it('should be defined', function () {
    expect(ctrl).toBeDefined();
  });

  it('should start with the active cluster being "none"', function () {
    expect(ctrl.active).toEqual('none');
  });

  it('should open the activated cluster in a new window', function () {
    $scope.activate_cb(null, {node: {id: 'foo1234_c23_nrps', original: {assembly_id: 'foo1234', cluster_number: 23}}});
    expect($window.open).toHaveBeenCalledWith('/output/foo1234/index.html#cluster-23', '_new');
  })

});

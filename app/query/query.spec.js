describe('QueryController', function(){
  beforeEach(function(){
    module('antismash.db.ui.query');
  });

  var $httpBackend;
  var createController;

  beforeEach(inject(function($injector){
    var $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');

    createController = function (){
      return $controller('QueryController');
    }

  }));

  it('should be defined', function(){
    var ctrl = createController();
    expect(ctrl).toBeDefined();
  });


});

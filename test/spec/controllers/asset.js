'use strict';

describe('Controller: AssetCtrl', function () {

  // load the controller's module
  beforeEach(module('hyenaSupportApp'));

  var AssetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetCtrl = $controller('AssetCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

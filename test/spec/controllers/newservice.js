'use strict';

describe('Controller: NewserviceCtrl', function () {

  // load the controller's module
  beforeEach(module('hyenaSupportApp'));

  var NewserviceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewserviceCtrl = $controller('NewserviceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

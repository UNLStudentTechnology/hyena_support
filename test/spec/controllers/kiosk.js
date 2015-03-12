'use strict';

describe('Controller: KioskCtrl', function () {

  // load the controller's module
  beforeEach(module('hyenaSupportApp'));

  var KioskCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KioskCtrl = $controller('KioskCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

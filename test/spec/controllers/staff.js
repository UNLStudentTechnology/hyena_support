'use strict';

describe('Controller: StaffCtrl', function () {

  // load the controller's module
  beforeEach(module('hyenaSupportApp'));

  var StaffCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StaffCtrl = $controller('StaffCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

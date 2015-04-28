'use strict';

describe('Service: Appointment', function () {

  // load the service's module
  beforeEach(module('hyenaSupportApp'));

  // instantiate service
  var Appointment;
  beforeEach(inject(function (_Appointment_) {
    Appointment = _Appointment_;
  }));

  it('should do something', function () {
    expect(!!Appointment).toBe(true);
  });

});

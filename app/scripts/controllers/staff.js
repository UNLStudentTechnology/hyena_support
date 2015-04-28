'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:StaffCtrl
 * @description
 * # StaffCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('StaffCtrl', function ($scope, $rootScope, $stateParams, UserService, ReservationService) {
  	//Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get the selected group from the route parameters and set it in the scope
    var staffId = $stateParams.staffId;
    $scope.staffId = $rootScope.currentGroupId = staffId;

    UserService.get(staffId).then(function(response) {
    	$scope.user = response.data;

    	//Get User's availability
	  	var availabilityUser = ReservationService.user(staffId, groupId).$asObject();
	  	availabilityUser.$bindTo($scope, 'availabilityUser');

	  	availabilityUser.$loaded().then(function(response) {
	  		console.log($scope.availabilityUser);
	  		//Get Schedule
		  	var schedule = ReservationService.schedule(staffId, groupId).$asObject();
		  	schedule.$bindTo($scope, 'schedule');
	  	});
    });
  });

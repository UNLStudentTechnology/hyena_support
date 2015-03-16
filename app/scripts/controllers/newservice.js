/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:NewserviceCtrl
 * @description
 * # NewserviceCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('NewServiceCtrl', function ($scope, $rootScope, $stateParams, ServiceService, Notification) {
     //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Default service settings
    $scope.service = {
    	created_at: moment().format(),
        group_id: parseInt(groupId),
        title: '',
        active: 1
    };

    /**
     * Creates a new service on the Firebase
     */
    $scope.createService = function() {
    	ServiceService.add($scope.service, groupId).then(function(response) {
    		console.log(response);
    		var serviceId = response.key();
    		//Redirect and notify
    		$scope.go('/'+groupId+'/service/'+serviceId);
    		Notification.show('Your service has been created successfully!', 'success');
    	}, function(error) {
    		console.log('Create Service Error', error);
    		Notification.show('There was an error creating your service.', 'error');
    	});
    };
  });

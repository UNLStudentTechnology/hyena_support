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
  .controller('NewServiceCtrl', function ($scope, $rootScope, $stateParams, ServiceService, Notification, FileReader) {
     //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Default service settings
    $scope.service = {
    	created_at: moment().format(),
        group_id: parseInt(groupId),
        title: '',
        active: 1,
        url: '',
        slot_size: 15,
        locations: []
    };

    $scope.addServiceLocation = function() {
        var location = {
            created_at: moment().format(),
            title: $scope.newLocationTitle
        };

        $scope.service.locations.push(location);
        $scope.newLocationTitle = "";
    };

    $scope.upload = function (files) {
      if (files && files.length) {
        FileReader.readAsDataURL(files[0], $scope).then(function(response) {
          $scope.service.icon_url = response;
        });
      }
    };

    $scope.removeImage = function() {
      $scope.service.icon_url = "";
    };

    /**
     * Creates a new service on the Firebase
     */
    $scope.createService = function() {
        var service = angular.copy($scope.service);

    	ServiceService.add(service, groupId).then(function(response) {
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

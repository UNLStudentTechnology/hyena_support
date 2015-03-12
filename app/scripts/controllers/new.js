/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:NewCtrl
 * @description
 * # NewCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('NewCtrl', function ($scope, $rootScope, $stateParams, AssetService, Notification) {
     //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Default asset settings
    $scope.asset = {
    	created_at: moment().format(),
        group_id: parseInt(groupId),
        title: ''
    };

    /**
     * Creates a new asset on the Firebase
     */
    $scope.createAsset = function() {
    	AssetService.add($scope.asset, groupId).then(function(response) {
    		console.log(response);
    		var assetId = response.key();
    		//Redirect and notify
    		$scope.go('/'+groupId+'/asset/'+assetId);
    		Notification.show('Your asset has been created successfully!', 'success');
    	}, function(error) {
    		console.log('Create Asset Error', error);
    		Notification.show('There was an error creating your asset.', 'error');
    	});
    };
  });

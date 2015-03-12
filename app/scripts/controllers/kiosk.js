'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:KioskCtrl
 * @description
 * # KioskCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('KioskCtrl', function ($scope, $rootScope, $stateParams, FirebaseGroupService, AssetService) {
    //Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;

  	//Get Group
  	$scope.group = null;
  	FirebaseGroupService.get(groupId).then(function(response) {
  		$scope.group = response.data;
  		console.log(response);
  	});

  	//Get Assets
    if(groupId !== "")
      $scope.assets = AssetService.groupAssets(groupId, 10).$asArray();
  });

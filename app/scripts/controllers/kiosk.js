'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:KioskCtrl
 * @description
 * # KioskCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('KioskCtrl', function ($scope, $rootScope, $stateParams, FirebaseGroupService, AssetService, ServiceService) {
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
    if(groupId !== "") {
      $scope.assets = AssetService.groupAssets(groupId, 10).$asArray();
      $scope.services = ServiceService.groupAssets(groupId, 10).$asArray();
    }

    //Form Data
    $scope.active_asset = {};

    /**
     * Set the current asset that we're looking for help for.
     * @param object assetObject
     */
    $scope.setActiveAsset = function(assetObject) {
      $scope.active_asset = assetObject;
    };

    $scope.setServiceUrl = function(serviceUrl) {
      var builtUrl = serviceUrl.replace(/:([a-zA-Z0-9_]+)/g, encodeURI($scope.active_asset.title));
      return builtUrl;
    };
  });

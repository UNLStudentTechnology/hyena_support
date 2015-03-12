'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:AssetCtrl
 * @description
 * # AssetCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('AssetCtrl', function ($scope, $rootScope, $stateParams, AssetService, Notification) {
    //Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get asset id
  	var assetId = $scope.assetId = $stateParams.assetId;

  	//Get asset
  	var asset = AssetService.get(assetId).$asObject();
  	asset.$bindTo($scope, 'asset');
  });

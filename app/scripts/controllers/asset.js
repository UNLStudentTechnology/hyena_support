'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:AssetCtrl
 * @description
 * # AssetCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('AssetCtrl', function ($scope, $rootScope, $stateParams, AssetService, ServiceService, Notification, FileReader) {
    //Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get asset id
  	var assetId = $scope.assetId = $stateParams.assetId;

  	//Get asset
  	var asset = AssetService.get(assetId).$asObject();
  	asset.$bindTo($scope, 'asset');

    asset.$loaded().then(function(response) {
      console.log($scope.asset);
      if(!angular.isDefined($scope.asset.services)) {
        $scope.asset.services = {};
      }
    });

    //Get services
    $scope.services = ServiceService.groupAssets(groupId, 10).$asArray();
    $scope.services.$loaded().then(function(response) {
      for (var i = 0; i < $scope.services.length; i++) {
        if(angular.isUndefined($scope.asset.services[$scope.services[i].$id]))
          $scope.asset.services[$scope.services[i].$id] = 0;
      }
    });

    $scope.upload = function (files) {
      if (files && files.length) {
        FileReader.readAsDataURL(files[0], $scope).then(function(response) {
          $scope.asset.icon_url = response;
        });
      }
    };
  });
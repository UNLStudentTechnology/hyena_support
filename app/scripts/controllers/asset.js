'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:AssetCtrl
 * @description
 * # AssetCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('AssetCtrl', function ($scope, $rootScope, $stateParams, AssetService, ServiceService, Notification) {
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

    $scope.$watch('asset', function() {
       console.log('hey, myVar has changed!');
    }, true);

    $scope.updateToggle = function(serviceId) {
      console.log('Toggle', $scope.asset.services[serviceId]);
      //$scope.asset.services[serviceId] = ($scope.asset.services[serviceId] > 0 ? "0" : "1"); 
    };
  });
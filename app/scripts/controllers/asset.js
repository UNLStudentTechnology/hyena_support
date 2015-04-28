'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:AssetCtrl
 * @description
 * # AssetCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('AssetCtrl', function ($scope, $rootScope, $stateParams, AssetService, ServiceService, GroupService, Notification, FileReader) {
    $scope.selectedTab = 0;
    //Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get asset id
  	var assetId = $scope.assetId = $stateParams.assetId;
    //Initialize sort variables
    $scope.userSortDirection = false;
    $scope.userSortField = "first_name";

  	//Get asset
  	var asset = AssetService.get(assetId).$asObject();
  	asset.$bindTo($scope, 'asset');

    asset.$loaded().then(function(response) {
      if(!angular.isDefined($scope.asset.services)) {
        $scope.asset.services = {};
      }
    });

    //Get the requested group by ID
    GroupService.get(groupId, 'users').then(function(response) {
      $scope.group = response.data;
      $scope.members = response.data.users;
    }, function(error) {
      Notification.show('Sorry! Unable to load your group.', 'error');
    });

    //Get services
    $scope.services = ServiceService.groupServices(groupId, 10).$asArray();
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

    $scope.removeImage = function() {
      $scope.asset.icon_url = "";
    };

    $scope.showRemoveAsset = function() {
      Notification.showModal('Remove Asset', '#modal-asset-remove');
    };

    $scope.removeAsset = function() {
      AssetService.remove(assetId).then(function() {
        Notification.hideModal();
        Notification.show('Your asset has been removed successfully!', 'success');

        //Navigate back to assets
        $scope.go('/'+groupId, 'animate-slide-left');
      }, function(error) {
        Notification.hideModal();
        console.log('Remove asset error:', error);
        Notification.show(error.message, 'error');
      });
    };
  });
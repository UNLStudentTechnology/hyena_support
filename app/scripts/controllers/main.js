'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('MainCtrl', function ($scope, $rootScope, $stateParams, $timeout, $localStorage, FirebaseGroupService, AssetService, ServiceService) {
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Check and see if the group exists in the Firebase, if not, add it.
    if(angular.isDefined(groupId) && groupId !== "")
      FirebaseGroupService.existsOrAdd(groupId);

    $scope.selectedTab = $localStorage.hyenaSupportApp_mainTab || 0;

    $scope.$watch('selectedTab', function(value) {
      $localStorage.hyenaSupportApp_mainTab = parseInt(value);
    });

  	//Get Assets and Services
    if(groupId !== "") {
      $scope.assets = AssetService.groupAssets(groupId, 10).$asArray();
      $scope.services = ServiceService.groupAssets(groupId, 10).$asArray();
    }

    $scope.updateToggle = function(asset) {
      $timeout(function(){ $scope.assets.$save(asset); }, 200);
    };
  });

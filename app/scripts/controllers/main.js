'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('MainCtrl', function ($scope, $rootScope, $stateParams, FirebaseGroupService, AssetService) {
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Check and see if the group exists in the Firebase, if not, add it.
    if(angular.isDefined(groupId) && groupId !== "")
      FirebaseGroupService.existsOrAdd(groupId);

  	//Get Assets
    if(groupId !== "")
      $scope.assets = AssetService.groupAssets(groupId, 10).$asArray();
  });

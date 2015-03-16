'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:ServiceCtrl
 * @description
 * # ServiceCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('ServiceCtrl', function ($scope, $rootScope, $stateParams, ServiceService, Notification) {
    //Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get service id
  	var serviceId = $scope.serviceId = $stateParams.serviceId;

  	//Get service
  	var service = ServiceService.get(serviceId).$asObject();
  	service.$bindTo($scope, 'service');
  });

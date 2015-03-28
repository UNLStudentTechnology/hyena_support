'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:ServiceCtrl
 * @description
 * # ServiceCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('ServiceCtrl', function ($scope, $rootScope, $stateParams, ServiceService, Notification, FileReader) {
    //Get and set the current group ID
  	var groupId = $stateParams.groupId;
  	$scope.groupId = $rootScope.currentGroupId = groupId;
  	//Get service id
  	var serviceId = $scope.serviceId = $stateParams.serviceId;

  	//Get service
  	var service = ServiceService.get(serviceId).$asObject();
  	service.$bindTo($scope, 'service');

    $scope.upload = function (files) {
      if (files && files.length) {
        FileReader.readAsDataURL(files[0], $scope).then(function(response) {
          $scope.service.icon_url = response;
        });
      }
    };
  });

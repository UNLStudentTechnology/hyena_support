/* global moment*/
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
    $scope.newLocationTitle = "";
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

    $scope.addServiceLocation = function() {
      var location = {
        created_at: moment().format(),
        title: $scope.newLocationTitle
      };

      ServiceService.addLocation(serviceId, location).then(function(response) {
        $scope.newLocationTitle = "";
      });
    };

    $scope.removeImage = function() {
      $scope.service.icon_url = "";
    };

    $scope.showRemoveService = function() {
      Notification.showModal('Remove Service', '#modal-service-remove');
    };

    $scope.removeServiceLocation = function(key) {
      delete $scope.service.locations[key];
      Notification.show('Location removed successfully!', 'success');
    };

    $scope.removeService = function() {
      ServiceService.remove(serviceId).then(function() {
        Notification.hideModal();
        Notification.show('Your service has been removed successfully!', 'success');

        //Navigate back to services
        $scope.go('/'+groupId, 'animate-slide-left');
      }, function(error) {
        Notification.hideModal();
        console.log('Remove service error:', error);
        Notification.show(error.message, 'error');
      });
    };
  });

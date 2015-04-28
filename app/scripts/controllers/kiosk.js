/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaSupportApp.controller:KioskCtrl
 * @description
 * # KioskCtrl
 * Controller of the hyenaSupportApp
 */
angular.module('hyenaSupportApp')
  .controller('KioskCtrl', function ($scope, $location, $rootScope, $stateParams, $filter, GroupService, AssetService, ServiceService, UserService, ReservationService, Notification) {
    var defaultData = {
      active_assest: null,
      authUser: null,
      defaultAsset: null,
      kioskNuid: '',
      loadingContent: false,
      schedule: null,
      selectedAppointment: null
    };

    $scope.moment = moment();
    $scope.processData = angular.copy(defaultData);

    //Get and set the current group ID
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Make sure users are starting at the first step
    if(angular.isUndefined($scope.processData.active_asset) || $scope.processData.active_asset === null)
      $location.path(groupId+'/kiosk/choose');

  	//Get Group with users
  	$scope.group = null;
  	GroupService.get(groupId, 'users').then(function(response) {
  		$scope.group = response.data;
  		console.log(response);
  	});

  	//Get Assets
    if(groupId !== "") {
      $scope.assets = AssetService.groupAssets(groupId, 30).$asArray();
      $scope.services = ServiceService.groupServices(groupId, 30).$asArray();
    }

    $scope.getAvailability = function() {
      var assets = [];
      //Filter the list of users
      for (var i = 0; i < $scope.group.users.length; i++) {
        if($scope.processData.active_asset.users[$scope.group.users[i].uni_auth] > 0)
          assets.push($scope.group.users[i].uni_auth);
      }

      //Asset display settings
      $scope.processData.defaultAsset = {
        hide_hour_after: "0900pm",
        hide_hour_before: "0800am",
        slot_size: 15,
        num_assets: assets.length,
        weekend: 0
      };

      //Get the assets needed for the copmarison
      ReservationService.assets(assets, groupId).then(function(promises) {
        //Run the comparison
        $scope.processData.schedule = ReservationService.compareAvailability(promises, $scope.processData.defaultAsset.slot_size);
      });
    };

    $scope.addBooking = function(day, hour) {
      console.log('Adding Booking', day, hour);
      Notification.showModal('Confirm appointment', '#modal-confirm-appointment');

      $scope.processData.selectedAppointment =  {
        day: day,
        hour: hour,
        timestamp: moment().dayOfYear(day).startOf('day').minutes(hour*60)
      };
    };

    $scope.confirmAppointment = function() {

    };

    /**
     * Set the current asset that we're looking for help for.
     * @param object assetObject
     */
    $scope.setActiveAsset = function(assetObject) {
      $scope.processData.active_asset = assetObject;
    };

    $scope.setServiceUrl = function(serviceUrl) {
      var builtUrl = serviceUrl.replace(/:([a-zA-Z0-9_]+)/g, encodeURI($scope.processData.active_asset.title));
      return builtUrl;
    };

    /**
     * Validates the NUID and returns a user object
     */
    $scope.validateAndGet = function() {
      $scope.processData.loadingContent = true;

      UserService.validateAndGet($scope.processData.kioskNuid).then(function(response) {
        Notification.show('Hello, '+response.first_name+'!', 'success');
        $scope.processData.authUser = response;
        //Hide loaders
        $scope.processData.loadingContent = false;
      }, function(error) {
        console.log(error);
        if(angular.isDefined(error.message))
          Notification.show(error.message, 'error');
        else
          Notification.show('Sorry! Unable to find a user with that NUID.', 'error');
        //Hide loaders
        $scope.processData.loadingContent = false;
      });
    };

    $scope.startOver = function() {
      $scope.processData = angular.copy(defaultData);
      $location.path(groupId+'/kiosk/choose');
    };
  });

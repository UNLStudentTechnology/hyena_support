/* global moment */
'use strict';

/**
 * @ngdoc service
 * @name hyenaGuestbooksApp.Guestbook
 * @description
 * # Guestbook
 * Service in the hyenaGuestbooksApp.
 */
angular.module('hyenaSupportApp')
  .service('ServiceService', function ($firebase, $q, AppFirebase, UserService) {
    var serviceRef = AppFirebase.getRef();
    
    var ServiceService =  {
		/**
		* Gets a specific asset
		* @param  string assetId
		* @return promise
		*/
		get: function getAsset(assetId) {
			assetId = assetId.trim();
				return $firebase(serviceRef.child('/services/'+assetId));
		},
		/**
		* Get all services associated with a group
		* @param  int groupId Group ID
		* @param  int limit   Number of items to return
		* @return promise
		*/
		groupAssets: function getGroupAssets(groupId, limit) {
			limit = limit || 20;
			groupId = parseInt(groupId);
			var services = serviceRef.child('services').orderByChild("group_id").equalTo(groupId).limitToFirst(limit);
			return $firebase(services);
		},
		add: function addAsset(asset, groupId) {
    		return $firebase(serviceRef.child('services')).$push(asset).then(function(response) {
	          //Add a reference to the group
	          $firebase(serviceRef.child('/groups/'+groupId+'/services')).$set(response.key(), true);
	          return response;
	        });
    	}
    };

    return ServiceService;
  });

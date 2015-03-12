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
  .service('AssetService', function ($firebase, $q, AppFirebase, UserService) {
    var assetRef = AppFirebase.getRef();
    
    var AssetService =  {
		/**
		* Gets a specific asset
		* @param  string assetId
		* @return promise
		*/
		get: function getAsset(assetId) {
			assetId = assetId.trim();
				return $firebase(assetRef.child('/assets/'+assetId));
		},
		/**
		* Get all assets associated with a group
		* @param  int groupId Group ID
		* @param  int limit   Number of items to return
		* @return promise
		*/
		groupAssets: function getGroupAssets(groupId, limit) {
			limit = limit || 20;
			groupId = parseInt(groupId);
			var assets = assetRef.child('assets').orderByChild("group_id").equalTo(groupId).limitToFirst(limit);
			return $firebase(assets);
		},
		add: function addAsset(asset, groupId) {
    		return $firebase(assetRef.child('assets')).$push(asset).then(function(response) {
	          //Add a reference to the group
	          $firebase(assetRef.child('/groups/'+groupId+'/assets')).$set(response.key(), true);
	          return response;
	        });
    	}
    };

    return AssetService;
  });

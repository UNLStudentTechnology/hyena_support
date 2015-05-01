'use strict';

/**
 * @ngdoc service
 * @name hyenaSupportApp.Appointment
 * @description
 * # Appointment
 * Service in the hyenaSupportApp.
 */
angular.module('hyenaSupportApp')
  .service('AppointmentService', function ($firebase, $q, AppFirebase) {
    var appointmentRef = AppFirebase.getRef();
    
    var AppointmentService =  {
		/**
		* Gets a specific appointment
		* @param  string appointmentId
		* @return promise
		*/
		get: function getAppointment(appointmentId) {
			appointmentId = appointmentId.trim();
				return $firebase(appointmentRef.child('appointments/'+appointmentId));
		},
		/**
		* Get all appointments associated with a group
		* @param  int groupId Group ID
		* @param  int limit   Number of items to return
		* @return promise
		*/
		groupAppointments: function getGroupAppointments(groupId, limit) {
			limit = limit || 50;
			groupId = parseInt(groupId);
			var appointments = appointmentRef.child('appointments').orderByChild("group_id").equalTo(groupId).limitToFirst(limit);
			return $firebase(appointments);
		},
		add: function addAppointment(appointment, groupId) {
    		return $firebase(appointmentRef.child('appointments')).$push(appointment).then(function(response) {
	          //Add a reference to the group
	          $firebase(appointmentRef.child('/groups/'+groupId+'/appointments')).$set(response.key(), true);
	          return response;
	        });
    	},
    	remove: function removeAppointment(appointmentId) {
    		appointmentId = appointmentId.trim();
			return $firebase(appointmentRef.child('appointments/'+appointmentId)).$remove();
    	}
    };

    return AppointmentService;
  });

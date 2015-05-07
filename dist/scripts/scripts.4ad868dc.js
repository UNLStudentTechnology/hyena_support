"use strict";angular.module("hyenaSupportApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","hyenaAngular","angularFileUpload","angularMoment","filereader"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){a.state("unl-layout",{templateUrl:"views/layouts/unl-layout.html",data:{requireAuth:!0}}).state("unl-layout-kiosk",{templateUrl:"views/layouts/unl-layout-kiosk.html",data:{requireAuth:!1}}).state("unl-layout.main",{url:"/:groupId",templateUrl:"views/main.html",controller:"MainCtrl"}).state("unl-layout.new_asset",{url:"/:groupId/asset/new",templateUrl:"views/new_asset.html",controller:"NewCtrl"}).state("unl-layout.asset",{url:"/:groupId/asset/:assetId",templateUrl:"views/asset.html",controller:"AssetCtrl"}).state("unl-layout.new_service",{url:"/:groupId/service/new",templateUrl:"views/new_service.html",controller:"NewServiceCtrl"}).state("unl-layout.service",{url:"/:groupId/service/:serviceId",templateUrl:"views/service.html",controller:"ServiceCtrl"}).state("unl-layout.staff",{url:"/:groupId/staff/:staffId",templateUrl:"views/staff.html",controller:"StaffCtrl"}).state("unl-layout-kiosk.support_kiosk",{url:"/:groupId/kiosk",templateUrl:"views/kiosk.html",controller:"KioskCtrl"}).state("unl-layout-kiosk.support_kiosk.choose",{url:"/choose",templateUrl:"views/kiosk/choose_product.html"}).state("unl-layout-kiosk.support_kiosk.method",{url:"/method",templateUrl:"views/kiosk/choose_method.html"}).state("unl-layout-kiosk.support_kiosk.signin",{url:"/signin",templateUrl:"views/kiosk/signin.html"}).state("unl-layout-kiosk.support_kiosk.appointment",{url:"/appointment",templateUrl:"views/kiosk/appointment.html"}),b.otherwise("/"),c.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://hyena-support.firebaseio.com/").constant("APIKEY","NTM5NTc4Y2Y3MGZhMzA0NTJlNTQwZDQ5").constant("APIPATH","https://itsgethelp.unl.edu/public/api/1.0/").constant("PLATFORM_ROOT","http://st-studio.unl.edu/hyena_platform/public/").constant("AUTH_SCOPE","groups"),angular.module("hyenaSupportApp").controller("MainCtrl",["$scope","$rootScope","$stateParams","$timeout","$localStorage","FirebaseGroupService","AssetService","ServiceService","GroupService","Notification",function(a,b,c,d,e,f,g,h,i,j){var k=c.groupId;a.groupId=b.currentGroupId=k,a.userSortDirection=!1,a.userSortField="first_name",angular.isDefined(k)&&""!==k&&f.existsOrAdd(k),a.selectedTab=e.hyenaSupportApp_mainTab||0,a.$watch("selectedTab",function(a){e.hyenaSupportApp_mainTab=parseInt(a)}),""!==k&&(a.assets=g.groupAssets(k).$asArray(),a.services=h.groupServices(k).$asArray(),i.get(k,"users").then(function(b){a.group=b.data,a.members=b.data.users},function(){j.show("Sorry! Unable to load your group.","error")})),a.updateToggle=function(b){d(function(){a.assets.$save(b)},200)}}]),angular.module("hyenaSupportApp").controller("KioskCtrl",["$scope","$location","$rootScope","$stateParams","$filter","GroupService","AssetService","ServiceService","UserService","ReservationService","AppointmentService","EmailService","Notification",function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n={active_assest:null,active_service:null,authUser:null,defaultAsset:null,kioskNuid:"",loadingContent:!1,schedule:null,selectedAppointment:null,selectedLocation:null,appointment_hour:-1,startDay:moment().dayOfYear(),availableStaff:[],selectedStaff:0};a.moment=moment,a.processData=angular.copy(n);var o=d.groupId;a.groupId=c.currentGroupId=o,(angular.isUndefined(a.processData.active_asset)||null===a.processData.active_asset)&&b.path(o+"/kiosk/choose"),a.group=null,f.get(o,"users").then(function(b){a.group=b.data}),""!==o&&(a.assets=g.groupAssets(o,30).$asArray(),a.services=h.groupServices(o,30).$asArray()),a.getAvailability=function(){for(var b=[],c=0;c<a.group.users.length;c++)a.processData.active_asset.users[a.group.users[c].uni_auth]>0&&(b.push(a.group.users[c].uni_auth),a.processData.availableStaff.push(a.group.users[c]));a.processData.defaultAsset={hide_hour_after:"0900pm",hide_hour_before:"0800am",slot_size:a.processData.active_service.slot_size||15,num_assets:b.length,weekend:0},j.assets(b,o).then(function(b){console.log("Promises",b),a.processData.schedule=j.compareAvailability(b,a.processData.defaultAsset.slot_size)})},a.changeSchedule=function(){var b=[];if("0"!=a.processData.selectedStaff)b.push(a.processData.selectedStaff);else for(var c=0;c<a.processData.availableStaff.length;c++)b.push(a.processData.availableStaff[c].uni_auth);j.assets(b,o).then(function(b){console.log("Promises",b),a.processData.schedule=j.compareAvailability(b,a.processData.defaultAsset.slot_size)})},a.addBooking=function(b,c){console.log("Adding Booking",b,c),m.showModal("Confirm appointment","#modal-confirm-appointment"),a.processData.selectedAppointment={created_at:moment().format(),day:b,hour:c,user:a.processData.authUser.uni_auth,topic:a.processData.active_asset.$id,service:a.processData.active_service.$id,details:a.processData.authUser.appointment_details||"",timestamp:moment().dayOfYear(b).startOf("day").minutes(60*c).format()}},a.confirmAppointment=function(){var b=a.processData.selectedAppointment;-1!=a.processData.selectedLocation&&(b.location=a.processData.selectedLocation),k.add(b,o).then(function(){a.closeModal(),a.startOver(),m.show("Your appointment has been confirmed!","success"),l.send(a.processData.authUser.email,a.processData.authUser.first_name+" "+a.processData.authUser.last_name,a.processData.authUser.first_name+", here are your appointment details.",a.processData.messageToUser,o).then(function(){},function(a){m.show(a.message,"error"),console.log("Unable to send email",a)})},function(a){console.log("Create appointment error",a),m.show("There was an error confirming your appointment.","error")})},a.setActiveAsset=function(b){a.processData.active_asset=b},a.setActiveService=function(b){a.processData.active_service=b},a.setServiceUrl=function(b){var c=b.replace(/:([a-zA-Z0-9_]+)/g,encodeURI(a.processData.active_asset.title));return c},a.validateAndGet=function(){a.processData.loadingContent=!0,i.validateAndGet(a.processData.kioskNuid).then(function(b){m.show("Hello, "+b.first_name+"!","success"),a.processData.authUser=b,a.processData.loadingContent=!1},function(b){console.log(b),angular.isDefined(b.message)?m.show(b.message,"error"):(a.processData.kioskNuid="",m.show("Sorry! Unable to find a user with that NUID.","error")),a.processData.loadingContent=!1})},a.startOver=function(){a.processData=angular.copy(n),b.path(o+"/kiosk/choose")}}]),angular.module("hyenaSupportApp").controller("NewCtrl",["$scope","$rootScope","$stateParams","AssetService","Notification",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,a.asset={created_at:moment().format(),group_id:parseInt(f),title:"",active:1},a.createAsset=function(){d.add(a.asset,f).then(function(b){console.log(b);var c=b.key();a.go("/"+f+"/asset/"+c),e.show("Your asset has been created successfully!","success")},function(a){console.log("Create Asset Error",a),e.show("There was an error creating your asset.","error")})}}]),angular.module("hyenaSupportApp").controller("AssetCtrl",["$scope","$rootScope","$stateParams","AssetService","ServiceService","GroupService","Notification","FileReader",function(a,b,c,d,e,f,g,h){a.selectedTab=0;var i=c.groupId;a.groupId=b.currentGroupId=i;var j=a.assetId=c.assetId;a.userSortDirection=!1,a.userSortField="first_name";var k=d.get(j).$asObject();k.$bindTo(a,"asset"),k.$loaded().then(function(){angular.isDefined(a.asset.services)||(a.asset.services={})}),f.get(i,"users").then(function(b){a.group=b.data,a.members=b.data.users},function(){g.show("Sorry! Unable to load your group.","error")}),a.services=e.groupServices(i,10).$asArray(),a.services.$loaded().then(function(){for(var b=0;b<a.services.length;b++)angular.isUndefined(a.asset.services[a.services[b].$id])&&(a.asset.services[a.services[b].$id]=0)}),a.upload=function(b){b&&b.length&&h.readAsDataURL(b[0],a).then(function(b){a.asset.icon_url=b})},a.removeImage=function(){a.asset.icon_url=""},a.showRemoveAsset=function(){g.showModal("Remove Asset","#modal-asset-remove")},a.removeAsset=function(){d.remove(j).then(function(){g.hideModal(),g.show("Your asset has been removed successfully!","success"),a.go("/"+i,"animate-slide-left")},function(a){g.hideModal(),console.log("Remove asset error:",a),g.show(a.message,"error")})}}]),angular.module("hyenaSupportApp").controller("NewServiceCtrl",["$scope","$rootScope","$stateParams","ServiceService","Notification","FileReader",function(a,b,c,d,e,f){var g=c.groupId;a.groupId=b.currentGroupId=g,a.service={created_at:moment().format(),group_id:parseInt(g),title:"",active:1,url:"",slot_size:15,locations:[]},a.addServiceLocation=function(){var b={created_at:moment().format(),title:a.newLocationTitle};a.service.locations.push(b),a.newLocationTitle=""},a.upload=function(b){b&&b.length&&f.readAsDataURL(b[0],a).then(function(b){a.service.icon_url=b})},a.removeImage=function(){a.service.icon_url=""},a.createService=function(){var b=angular.copy(a.service);d.add(b,g).then(function(b){console.log(b);var c=b.key();a.go("/"+g+"/service/"+c),e.show("Your service has been created successfully!","success")},function(a){console.log("Create Service Error",a),e.show("There was an error creating your service.","error")})}}]),angular.module("hyenaSupportApp").service("AssetService",["$firebase","$q","AppFirebase",function(a,b,c){var d=c.getRef(),e={get:function(b){return b=b.trim(),a(d.child("/assets/"+b))},groupAssets:function(b,c){c=c||50,b=parseInt(b);var e=d.child("assets").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(e)},add:function(b,c){return a(d.child("assets")).$push(b).then(function(b){return a(d.child("/groups/"+c+"/assets")).$set(b.key(),!0),b})},remove:function(b){return b=b.trim(),a(d.child("/assets/"+b)).$remove()}};return e}]),angular.module("hyenaSupportApp").service("ServiceService",["$firebase","$q","AppFirebase","UserService",function(a,b,c){var d=c.getRef(),e={get:function(b){return b=b.trim(),a(d.child("/services/"+b))},groupServices:function(b,c){c=c||50,b=parseInt(b);var e=d.child("services").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(e)},add:function(b,c){return a(d.child("services")).$push(b).then(function(b){return a(d.child("/groups/"+c+"/services")).$set(b.key(),!0),b})},addLocation:function(b,c){return a(d.child("services/"+b+"/locations")).$push(c)},remove:function(b){return b=b.trim(),a(d.child("/services/"+b)).$remove()}};return e}]),angular.module("hyenaSupportApp").controller("ServiceCtrl",["$scope","$rootScope","$stateParams","ServiceService","Notification","FileReader",function(a,b,c,d,e,f){a.newLocationTitle="";var g=c.groupId;a.groupId=b.currentGroupId=g;var h=a.serviceId=c.serviceId,i=d.get(h).$asObject();i.$bindTo(a,"service"),a.upload=function(b){b&&b.length&&f.readAsDataURL(b[0],a).then(function(b){a.service.icon_url=b})},a.addServiceLocation=function(){var b={created_at:moment().format(),title:a.newLocationTitle};d.addLocation(h,b).then(function(){a.newLocationTitle="",e.show("Location added successfully!","success")},function(a){console.log("Adding location error",a),e.show("Sorry! There was an error adding that location.","error")})},a.removeImage=function(){a.service.icon_url=""},a.showRemoveService=function(){e.showModal("Remove Service","#modal-service-remove")},a.removeServiceLocation=function(b){delete a.service.locations[b],e.show("Location removed successfully!","success")},a.removeService=function(){d.remove(h).then(function(){e.hideModal(),e.show("Your service has been removed successfully!","success"),a.go("/"+g,"animate-slide-left")},function(a){e.hideModal(),console.log("Remove service error:",a),e.show(a.message,"error")})}}]),angular.module("hyenaSupportApp").controller("StaffCtrl",["$scope","$rootScope","$stateParams","UserService","ReservationService",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f;var g=c.staffId;a.staffId=b.currentGroupId=g,d.get(g).then(function(b){a.user=b.data;var c=e.user(g,f).$asObject();c.$bindTo(a,"availabilityUser"),c.$loaded().then(function(){console.log(a.availabilityUser);var b=e.schedule(g,f).$asObject();b.$bindTo(a,"schedule")})})}]),angular.module("hyenaSupportApp").service("AppointmentService",["$firebase","$q","AppFirebase",function(a,b,c){var d=c.getRef(),e={get:function(b){return b=b.trim(),a(d.child("appointments/"+b))},groupAppointments:function(b,c){c=c||50,b=parseInt(b);var e=d.child("appointments").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(e)},add:function(b,c){return a(d.child("appointments")).$push(b).then(function(b){return a(d.child("/groups/"+c+"/appointments")).$set(b.key(),!0),b})},remove:function(b){return b=b.trim(),a(d.child("appointments/"+b)).$remove()}};return e}]);
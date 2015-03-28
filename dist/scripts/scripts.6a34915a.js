"use strict";angular.module("hyenaSupportApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","hyenaAngular","angularFileUpload","filereader"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){a.state("unl-layout",{templateUrl:"views/layouts/unl-layout.html",data:{requireAuth:!0}}).state("unl-layout-kiosk",{templateUrl:"views/layouts/unl-layout-kiosk.html",data:{requireAuth:!1}}).state("unl-layout.main",{url:"/:groupId",templateUrl:"views/main.html",controller:"MainCtrl"}).state("unl-layout.new_asset",{url:"/:groupId/asset/new",templateUrl:"views/new_asset.html",controller:"NewCtrl"}).state("unl-layout.asset",{url:"/:groupId/asset/:assetId",templateUrl:"views/asset.html",controller:"AssetCtrl"}).state("unl-layout.new_service",{url:"/:groupId/service/new",templateUrl:"views/new_service.html",controller:"NewServiceCtrl"}).state("unl-layout.service",{url:"/:groupId/service/:serviceId",templateUrl:"views/service.html",controller:"ServiceCtrl"}).state("unl-layout-kiosk.support_kiosk",{url:"/:groupId/kiosk",templateUrl:"views/kiosk.html",controller:"KioskCtrl"}).state("unl-layout-kiosk.support_kiosk.choose",{url:"/choose",templateUrl:"views/kiosk/choose_product.html"}).state("unl-layout-kiosk.support_kiosk.method",{url:"/method",templateUrl:"views/kiosk/choose_method.html"}),b.otherwise("/"),c.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://hyena-support.firebaseio.com/").constant("APIKEY","NTM5NTc4Y2Y3MGZhMzA0NTJlNTQwZDQ5").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("PLATFORM_ROOT","http://st-studio.unl.edu/hyena_platform/public/").constant("AUTH_SCOPE","groups"),angular.module("hyenaSupportApp").controller("MainCtrl",["$scope","$rootScope","$stateParams","$timeout","$localStorage","FirebaseGroupService","AssetService","ServiceService",function(a,b,c,d,e,f,g,h){var i=c.groupId;a.groupId=b.currentGroupId=i,angular.isDefined(i)&&""!==i&&f.existsOrAdd(i),a.selectedTab=e.hyenaSupportApp_mainTab||0,a.$watch("selectedTab",function(a){e.hyenaSupportApp_mainTab=parseInt(a)}),""!==i&&(a.assets=g.groupAssets(i,10).$asArray(),a.services=h.groupAssets(i,10).$asArray()),a.updateToggle=function(b){d(function(){a.assets.$save(b)},200)}}]),angular.module("hyenaSupportApp").controller("KioskCtrl",["$scope","$location","$rootScope","$stateParams","FirebaseGroupService","AssetService","ServiceService",function(a,b,c,d,e,f,g){var h=d.groupId;a.groupId=c.currentGroupId=h,angular.isUndefined(a.active_asset)&&b.path(h+"/kiosk/choose"),a.group=null,e.get(h).then(function(b){a.group=b.data,console.log(b)}),""!==h&&(a.assets=f.groupAssets(h,10).$asArray(),a.services=g.groupAssets(h,10).$asArray()),a.active_asset={},a.setActiveAsset=function(b){a.active_asset=b},a.setServiceUrl=function(b){var c=b.replace(/:([a-zA-Z0-9_]+)/g,encodeURI(a.active_asset.title));return c}}]),angular.module("hyenaSupportApp").controller("NewCtrl",["$scope","$rootScope","$stateParams","AssetService","Notification",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,a.asset={created_at:moment().format(),group_id:parseInt(f),title:"",active:1},a.createAsset=function(){d.add(a.asset,f).then(function(b){console.log(b);var c=b.key();a.go("/"+f+"/asset/"+c),e.show("Your asset has been created successfully!","success")},function(a){console.log("Create Asset Error",a),e.show("There was an error creating your asset.","error")})}}]),angular.module("hyenaSupportApp").controller("AssetCtrl",["$scope","$rootScope","$stateParams","AssetService","ServiceService","Notification","FileReader",function(a,b,c,d,e,f,g){var h=c.groupId;a.groupId=b.currentGroupId=h;var i=a.assetId=c.assetId,j=d.get(i).$asObject();j.$bindTo(a,"asset"),j.$loaded().then(function(){console.log(a.asset),angular.isDefined(a.asset.services)||(a.asset.services={})}),a.services=e.groupAssets(h,10).$asArray(),a.services.$loaded().then(function(){for(var b=0;b<a.services.length;b++)angular.isUndefined(a.asset.services[a.services[b].$id])&&(a.asset.services[a.services[b].$id]=0)}),a.upload=function(b){b&&b.length&&g.readAsDataURL(b[0],a).then(function(b){a.asset.icon_url=b})}}]),angular.module("hyenaSupportApp").controller("NewServiceCtrl",["$scope","$rootScope","$stateParams","ServiceService","Notification",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,a.service={created_at:moment().format(),group_id:parseInt(f),title:"",active:1,url:""},a.createService=function(){d.add(a.service,f).then(function(b){console.log(b);var c=b.key();a.go("/"+f+"/service/"+c),e.show("Your service has been created successfully!","success")},function(a){console.log("Create Service Error",a),e.show("There was an error creating your service.","error")})}}]),angular.module("hyenaSupportApp").service("AssetService",["$firebase","$q","AppFirebase","UserService",function(a,b,c){var d=c.getRef(),e={get:function(b){return b=b.trim(),a(d.child("/assets/"+b))},groupAssets:function(b,c){c=c||20,b=parseInt(b);var e=d.child("assets").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(e)},add:function(b,c){return a(d.child("assets")).$push(b).then(function(b){return a(d.child("/groups/"+c+"/assets")).$set(b.key(),!0),b})}};return e}]),angular.module("hyenaSupportApp").service("ServiceService",["$firebase","$q","AppFirebase","UserService",function(a,b,c){var d=c.getRef(),e={get:function(b){return b=b.trim(),a(d.child("/services/"+b))},groupAssets:function(b,c){c=c||20,b=parseInt(b);var e=d.child("services").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(e)},add:function(b,c){return a(d.child("services")).$push(b).then(function(b){return a(d.child("/groups/"+c+"/services")).$set(b.key(),!0),b})}};return e}]),angular.module("hyenaSupportApp").controller("ServiceCtrl",["$scope","$rootScope","$stateParams","ServiceService","Notification","FileReader",function(a,b,c,d,e,f){var g=c.groupId;a.groupId=b.currentGroupId=g;var h=a.serviceId=c.serviceId,i=d.get(h).$asObject();i.$bindTo(a,"service"),a.upload=function(b){b&&b.length&&f.readAsDataURL(b[0],a).then(function(b){a.service.icon_url=b})}}]);
'use strict';

/**
 * @ngdoc overview
 * @name hyenaSupportApp
 * @description
 * # hyenaSupportApp
 *
 * Main module of the application.
 */
angular
  .module('hyenaSupportApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'hyenaAngular'
    ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      //Layouts
      .state('unl-layout', {
        templateUrl: 'views/layouts/unl-layout.html',
        data: {
          requireAuth: true
        }
      })
      .state('unl-layout-kiosk', {
        templateUrl: 'views/layouts/unl-layout-kiosk.html',
        data: {
          requireAuth: false
        }
      })
      //Views
      .state('unl-layout.main', {
        url: '/:groupId',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('unl-layout.new_asset', {
        url: '/:groupId/asset/new',
        templateUrl: 'views/new_asset.html',
        controller: 'NewCtrl'
      })
      .state('unl-layout.asset', {
        url: '/:groupId/asset/:assetId',
        templateUrl: 'views/asset.html',
        controller: 'AssetCtrl'
      })
      .state('unl-layout.new_service', {
        url: '/:groupId/service/new',
        templateUrl: 'views/new_service.html',
        controller: 'NewServiceCtrl'
      })
      .state('unl-layout.service', {
        url: '/:groupId/service/:serviceId',
        templateUrl: 'views/service.html',
        controller: 'ServiceCtrl'
      })
      //Kiosk
      .state('unl-layout-kiosk.support_kiosk', {
        url: '/:groupId/kiosk',
        templateUrl: 'views/kiosk.html',
        controller: 'KioskCtrl'
      })
      .state('unl-layout-kiosk.support_kiosk.choose', {
        url: '/choose',
        templateUrl: 'views/kiosk/choose_product.html'
      })
      .state('unl-layout-kiosk.support_kiosk.method', {
        url: '/method',
        templateUrl: 'views/kiosk/choose_method.html'
      });
      //End Kiosks
      
      //Default Route
      $urlRouterProvider.otherwise("/");
      //End Default Route
      
      //Remove # from URLs
      $locationProvider.html5Mode(true);
  })
  .config(function ($httpProvider) {
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  })
  .constant('FBURL', 'https://hyena-support.firebaseio.com/')
  .constant('APIKEY', 'NTM5NTc4Y2Y3MGZhMzA0NTJlNTQwZDQ5')
  .constant('APIPATH', 'http://st-studio.unl.edu/hyena_platform/public/api/1.0/')
  .constant('PLATFORM_ROOT', 'http://st-studio.unl.edu/hyena_platform/public/')
  .constant('AUTH_SCOPE', 'groups');
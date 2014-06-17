'use strict';

/**
 * @ngdoc overview
 * @name irateApp
 * @description
 * # irateApp
 *
 * Main module of the application.
 */
angular
  .module('irateApp', [
    'famous.angular',
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

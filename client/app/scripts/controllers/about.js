'use strict';

/**
 * @ngdoc function
 * @name irateApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the irateApp
 */
angular.module('irateApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

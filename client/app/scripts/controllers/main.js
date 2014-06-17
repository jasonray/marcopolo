'use strict';

/**
 * @ngdoc function
 * @name irateApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the irateApp
 */
angular.module('irateApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

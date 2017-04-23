'use strict';

/**
 * @ngdoc overview
 * @name bibiApp
 * @description
 * # bibiApp
 *
 * Main module of the application.
 */
angular
  .module('bibiApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

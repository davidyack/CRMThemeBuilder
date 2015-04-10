'use strict';

angular.module('themeBuilderApp', [
  //'ngCookies',
  'ngResource',
  //'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'flux',
  'colorpicker.module',
  'angularSpectrumColorpicker',
  'angularFileUpload'
])
  .constant('_', window._)
  .run(function ($rootScope) {
     $rootScope._ = window._;
  })
  .config(function ($urlRouterProvider, $locationProvider, $stateProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $stateProvider.state('area', {
      templateUrl: 'app/main.html',
      url: '/',
    });
  });





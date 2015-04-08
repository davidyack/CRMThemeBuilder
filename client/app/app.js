'use strict';

angular.module('app', [
  //'ngCookies',
  'ngResource',
  //'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'flux',
  'colorpicker.module',
  'angularSpectrumColorpicker'
])
  .constant('_', window._)
  .run(function ($rootScope) {
     $rootScope._ = window._;
  })
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });





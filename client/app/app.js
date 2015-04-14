'use strict';

angular.module('themeBuilderApp', [
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
  .config(function ($urlRouterProvider,  $stateProvider) {
    $urlRouterProvider
      .otherwise('/');

    $stateProvider.state('area', {
      templateUrl: 'app/main.html',
      url: '/',
    });
  });





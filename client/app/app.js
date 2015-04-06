'use strict';

angular.module('crmthemeBuilderApp', [
  //'ngCookies',
  //'ngResource',
  //'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'flux',
  'colorpicker.module'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })
  .store('ThemeStore', ['flux', '$http', ThemeStore])
  .directive('themepacks', ThemePacks)
  .directive('currentthemes', CurrentThemes)
  .directive('navbar', NavBar);


  function NavBar($modal) {
    return {
      scope: {},
      replace: true,
      templateUrl: '/app/navbar.html',
      controller: function($scope, ThemeStore) {
        $scope.add = function() {
          var modalInstance = $modal.open({
            templateUrl: '/app/modal.theme.html',
            controller: function($scope, $modalInstance) {

              $scope.ok = function () {
                $modalInstance.close($scope.theme);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });
          modalInstance.result.then(function(theme) {
            $scope.selected = selectedItem;
          });
        }
      }
    };
  };

  function CurrentThemes() {
    return {
      scope: {},
      replace: true,
      templateUrl: '/app/currentthemes.html',
      controller: function($scope, ThemeStore) {
        $scope.currentThemes = ThemeStore.currentThemes;
        $scope.$listenTo(ThemeStore, 'currentthemes.changed', function() {
          $scope.currentThemes = ThemeStore.currentThemes;
        });
        $scope.activate = function(theme) {
        };
        $scope.edit = function(theme) {
        };
        $scope.copy = function(theme) {
        };
        $scope.download = function(theme) {
        };
      }
    };
  };

  function ThemePacks() {
    return {
      scope: {},
      replace: true,
      templateUrl: '/app/themepacks.html',
      controller: function($scope, ThemeStore, $modal) {
        $scope.themePacks = ThemeStore.themePacks;
        $scope.$listenTo(ThemeStore, 'themepacks.changed', function() {
          $scope.themePacks = ThemeStore.themePacks;
        });
        $scope.install = function(themePack) {
        };
        $scope.edit = function(themePack) {
        };
        $scope.preview = function(themePack) {
          var modalInstance = $modal.open({
            templateUrl: '/app/modal.carousel.html',
            resolve: {
              themePack: function () {
                return themePack;
              }
            },
            controller: function($scope, $modalInstance, themePack) {
              $scope.themePack = themePack;

              $scope.ok = function () {
                $modalInstance.close($scope.theme);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });
          modalInstance.result.then(function(theme) {
            $scope.selected = selectedItem;
          });
        };
      }
    };
  };

  function ThemeStore(flux, $http) {
    var state = flux.immutable({
      currentThemes: [],
      themePacks: [],
      loading: false
    });
    var loaded = false;
    return {
      handlers: {
        'add': 'add'
      },
      loadThemes: function() {
        state = state.set('loading', true);
        this.emit('themes.loading');
        var self = this;
        $http.get('/api/themes').success(function(data, status, headers, config) {
          state = state.themePacks.concat(data.ThemePacks);
          self.emit('themepacks.changed');

          state = state.currentThemes.concat(data.CurrentThemes);
          self.emit('currentthemes.changed');

          state = state.set('loading', false);
          loaded = true;
          self.emit('themes.changed');
        });
      },
      add: function(theme) {
        state = state.currentThemes.concat(theme);
        this.emit('currentThemes.changed');
      },
      exports: {
        get themePacks() {
          if (!loaded && !state.loading) {
            this.loadThemes();
          }
          return state.themePacks;
        },
        get currentThemes() {
          if (!loaded && !state.loading) {
            this.loadThemes();
          }
          return state.currentThemes;
        }
      }
    };
  };

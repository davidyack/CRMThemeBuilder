'use strict';

angular.module('app', [
  //'ngCookies',
  //'ngResource',
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
  })
  .factory('CommonActions', CommonActions)
  .factory('ThemesActions', ThemesActions)
  .factory('PacksActions', PacksActions)
  .store('ThemesStore', ['flux', '_',  ThemesStore])
  .store('PacksStore', ['flux',  PacksStore])
  .directive('packs', Packs)
  .directive('themes', Themes)
  .directive('navbar', NavBar);


  function CommonActions($http, flux) {
    var loaded = false;
    var loading = false;
    return {
      loadThemesAndPacks: function() {
        if (!loaded && !loading) {
          loading = true;
            $http.get('/api/ThemeBuilder')
              .success(function(data, status, headers, config) {
                flux.dispatch('packsLoaded', data.ThemePacks);
                flux.dispatch('themesLoaded', data.CurrentThemes);
                loading = true;
                loaded = true;
              })
        }
      }
    }
  }

  function ThemesActions($http, flux, _) {
    return {
      add: function(theme) {
        theme.localId = _.uniqueId();
        flux.dispatch('themeAdd', theme);
        $http.post('/api/ThemeBuilder', theme)
          .success(function(data, status, headers, config) {
            data.localId = theme.localId;
            flux.dispatch('themeAdded', data);
          });
      },
      edit: function(theme) {
        flux.dispatch('themeUpdated', theme);
        $http.put('/api/ThemeBuilder', theme)
          .success(function(data, status, headers, config) {
            flux.dispatch('themeUpdated', data);
          });
      }
    }
  }

  function ThemesStore(flux,_) {
    var state = flux.immutable({
      themes: [],
    });
    return {
      handlers: {
        'themesLoaded': 'onLoaded',
        'themeUpdated': 'onUpdated',
        'themeAdded': 'onAdded',
        'themeAdd': 'add'
      },
      onAdded: function(theme) {
        var idx = _.findLastIndex(state.themes, {localId: theme.localId});
        delete theme.localId;
        state = state.themes.splice(idx, 1, theme);
        this.emit('themes.changed');
      },
      onLoaded: function(themes) {
        state = state.themes.splice(0, state.themes.length);
        state = state.themes.concat(themes);
        this.emit('themes.changed');
      },
      onUpdated: function(theme) {
      },
      add: function(theme) {
        state = state.themes.concat(theme);
        this.emit('themes.changed');
      },
      exports: {
        get themes() {
          return state.themes;
        }
      }
    }
  };

  function PacksActions($http, flux) {
    return {
      edit: function(pack) {
        flux.dispatch('packUpdated', pack);
        $http.put('/api/ThemeBuilder', pack)
          .success(function(data, status, headers, config) {
            flux.dispatch('packUpdated', data);
          });
      }
    };
  }

  function PacksStore(flux, _) {
    var state = flux.immutable({
      packs: [],
    });
    return {
      handlers: {
        'packsLoaded': 'onLoad',
        'packUpdated': 'onUpdate'
      },
      onUpdate: function(pack) {
      },
      onLoad: function(packs) {
        state = state.packs.splice(0, state.packs.length);
        state = state.packs.concat(packs);
        this.emit('packs.changed');
      },
      exports: {
        get packs() {
          return state.packs;
        }
      }
    }
  };


  function NavBar($modal) {
    return {
      scope: {},
      replace: true,
      templateUrl: '/app/navbar.html',
      controller: function($scope, ThemesActions) {
        $scope.add = function() {
          var modalInstance = $modal.open({
            templateUrl: '/app/modal.theme.html',
            controller: function($scope, $modalInstance) {
              $scope.theme = {};
              $scope.ok = function () {
                $modalInstance.close($scope.theme);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });
          modalInstance.result.then(function(theme) {
            ThemesActions.add(theme);
          });
        }
      }
    };
  };

  function Themes($modal) {
    return {
      scope: {},
      replace: true,
      templateUrl: '/app/themes.html',
      controller: function($scope, ThemesStore, CommonActions, ThemesActions) {
        CommonActions.loadThemesAndPacks();

        $scope.themes = ThemesStore.themes;
        $scope.$listenTo(ThemesStore, 'themes.changed', function() {
          $scope.themes = ThemesStore.themes;
        });
        $scope.activate = function(theme) {
        };
        $scope.edit = function(theme) {
          var modalInstance = $modal.open({
            templateUrl: '/app/modal.theme.html',
            controller: function($scope, $modalInstance) {
              $scope.theme = theme;
              $scope.ok = function () {
                $modalInstance.close($scope.theme);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });
          modalInstance.result.then(function(theme) {
            ThemesActions.edit(theme);
          });
        };
        $scope.copy = function(theme) {
        };
        $scope.download = function(theme) {
        };
      }
    };
  };

  function Packs() {
    return {
      scope: {},
      replace: true,
      templateUrl: '/app/packs.html',
      controller: function($scope, PacksStore, CommonActions, $modal, PacksActions) {
        CommonActions.loadThemesAndPacks();

        $scope.packs = PacksStore.packs;
        $scope.$listenTo(PacksStore, 'packs.changed', function() {
          $scope.packs = PacksStore.packs;
        });
        $scope.install = function(pack) {
        };
        $scope.edit = function(theme) {
          var modalInstance = $modal.open({
            templateUrl: '/app/modal.theme.html',
            controller: function($scope, $modalInstance) {
              $scope.theme = theme;
              $scope.ok = function () {
                $modalInstance.close($scope.theme);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });
          modalInstance.result.then(function(theme) {
            PacksActions.edit(theme);
          });
        };
        $scope.preview = function(pack) {
          var modalInstance = $modal.open({
            templateUrl: '/app/modal.carousel.html',
            resolve: {
              pack: function () {
                return pack;
              }
            },
            controller: function($scope, $modalInstance, pack) {
              $scope.pack = pack;

              $scope.ok = function () {
                $modalInstance.close($scope.theme);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });
          modalInstance.result.then(function(pack) {
          });
        };
      }
    };
  };

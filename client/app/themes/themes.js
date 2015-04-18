'use strict';

angular.module('themeBuilderApp')
  .factory('ThemesActions', function ( flux, _, $window, $resource, AlertsActions) {
    var ThemeResource = $resource($window.ThemeBuilderThemesURL || '/api/themes', null, {
        'delete': { method:'DELETE' },
        'update': { method:'PUT' }
    });
    var ThemeActivateResource = $resource($window.ThemeBuilderThemeActivateURL || '/api/themes/activate');
    var ThemeCopyResource = $resource($window.ThemeBuilderThemeCopyURL || '/api/themes/copy');

    return {
      load: function() {
        flux.dispatch('themesLoading', data);
        var data = ThemeResource.query(function() {
          flux.dispatch('themesLoaded', data);
        });
      },
      activate: function(theme) {
        ThemeActivateResource.save({themeId: theme.themeID}, function() {
        });
      },
      add: function(theme) {
        theme.localId = _.uniqueId();
        flux.dispatch('themeAdd', theme);
        ThemeResource.save(theme, function(data) {
          data.localId = theme.localId;
          flux.dispatch('themeAdded', data);
        });
      },
      remove: function(theme) {
        var self = this;
        ThemeResource.remove({themeId: theme.themeID}, function() {
          self.load();
          AlertsActions.add({type: 'success', msg: 'Theme deleted', timeout: 3000});
        });
      },
      copy: function(theme) {
        var self = this;
        ThemeCopyResource.save({themeId: theme.themeID}, function() {
          self.load();
        });
      },
      edit: function(theme) {
        flux.dispatch('themeUpdated', theme);
        ThemeResource.update(theme, function(data) {
          flux.dispatch('themeUpdated', data);
        });
      },
      download: function(theme) {
        var data = JSON.stringify(theme);
        var userAgent = 'navigator' in $window && 'userAgent' in $window.navigator &&
          $window.navigator.userAgent.toLowerCase() || '';
        if (/msie/i.test(userAgent) || 'ActiveXObject' in window) {
          var blob1 = new Blob([data]);
          $window.navigator.msSaveBlob(blob1, 'theme.json');
        } else {
          var element = angular.element('<a/>');
          element.attr({
            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
            target: '_blank',
            download: 'theme.json'
          })[0].click();
        }
      }
    };
  });

angular.module('themeBuilderApp')
  .store('ThemesStore', ['flux', '_', function(flux,_) {
    var state = flux.immutable({
      themes: [],
      meta: {
        loading: false,
        loaded: false
      }
    });
    return {
      handlers: {
        'themesLoaded': 'onLoaded',
        'themesLoading': 'onLoading',
        'themeAdded': 'onAdded',
        'themeAdd': 'add'
      },
      onAdded: function(theme) {
        var idx = _.findLastIndex(state.themes, {localId: theme.localId});
        delete theme.localId;
        state = state.themes.splice(idx, 1, theme);
        this.emit('themes.changed');
      },
      onLoading: function() {
        state = state.meta.set('loading', true);
      },
      onLoaded: function(themes) {
        state = state.meta.set('loading', false);
        state = state.meta.set('loaded', true);
        state = state.themes.splice(0, state.themes.length);
        state = state.themes.concat(themes);
        this.emit('themes.changed');
      },
      add: function(theme) {
        state = state.themes.concat(theme);
        this.emit('themes.changed');
      },
      exports: {
        get meta() {
          return state.meta;
        },
        get themes() {
          return state.themes;
        }
      }
    };
  }]);

angular.module('themeBuilderApp')
  .directive('themes', function() {
    return {
      scope: {},
      replace: true,
      templateUrl: 'app/themes/themes.html',
      controller: function($scope, $modal, ThemesStore, ThemesActions) {
        var loading = ThemesStore.meta.loading;
        var loaded = ThemesStore.meta.loaded;
        if (!loaded && !loading) {
          ThemesActions.load();
        }

        $scope.themes = ThemesStore.themes;
        $scope.$listenTo(ThemesStore, 'themes.changed', function() {
          $scope.themes = ThemesStore.themes;
        });
        $scope.activate = function(theme) {
          ThemesActions.activate(theme);
        };
        $scope.edit = function(theme) {
          var modalInstance = $modal.open({
            templateUrl: 'app/modal.theme.html',
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
        $scope.remove= function(theme) {
          ThemesActions.remove(theme);
        };
        $scope.copy = function(theme) {
          ThemesActions.copy(theme);
        };
        $scope.download = function(theme) {
          ThemesActions.download(theme);
        };
      }
    };
  });



angular.module('themeBuilderApp').
  factory('ThemeResource', function($resource) {
    return $resource('/api/themes', null, {
        'update': { method:'PUT' }
    });
});

angular.module('themeBuilderApp').
  factory('ThemeActionResource', function($resource) {
    return $resource('/api/themes/:action');
});


angular.module('themeBuilderApp')
  .factory('ThemesActions', function (ThemeResource, ThemeActionResource, flux, _, $window) {
    var loaded = false;
    var loading = false;
    return {
      init: function() {
        if (!loaded && !loading) {
          loading = true;
          var data = ThemeResource.query(function(data) {
            flux.dispatch('themesLoaded', data);
            loading = true;
            loaded = true;
          });
        }
      },
      activate: function(theme) {
        ThemeActionResource.save({action: 'activate'}, {themeId: theme.themeID}, function() {
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
      copy: function(theme) {
        ThemeActionResource.save({action: 'copy'}, {themeId: theme.themeID}, function() {
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
    };
  }]);

angular.module('themeBuilderApp')
  .directive('themes', function() {
    return {
      scope: {},
      replace: true,
      templateUrl: 'app/themes/themes.html',
      controller: function($scope, $modal, ThemesStore, ThemesActions) {
        ThemesActions.init();

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
        $scope.copy = function(theme) {
          ThemesActions.copy(theme);
        };
        $scope.download = function(theme) {
          ThemesActions.download(theme);
        };
      }
    };
  });



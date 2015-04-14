'use strict';


angular.module('themeBuilderApp')
  .factory('PacksActions', function(flux, $resource, $window, AlertsActions) {
    var loaded = false;
    var loading = false;
    var PacksResource = $resource($window.ThemeBuilderPacksURL || '/api/packs', null, {
        'update': { method:'PUT' }
    });
    var PackInstallResource = $resource($window.ThemeBuilderPackInstallURL || '/api/packs/install');
    return {
      init: function() {
        if (!loaded && !loading) {
          loading = true;
          var data = PacksResource.query(function() {
            flux.dispatch('packsLoaded', data);
            loading = true;
            loaded = true;
          });
        }
      },
      install: function(pack) {
        PackInstallResource.save({themeId: pack.themeID}, function() {
          AlertsActions.add({type: 'success', msg: 'Theme successfully installed', timeout: 3000});
        });
      },
      edit: function(pack) {
        flux.dispatch('packUpdated', pack);
        PacksResource.update(pack, function(data) {
          flux.dispatch('packUpdated', data);
        });
      }
    };
  });

angular.module('themeBuilderApp')
  .store('PacksStore', ['flux', function(flux) {
    var state = flux.immutable({
      packs: [],
    });
    return {
      handlers: {
        'packsLoaded': 'onLoad',
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
    };
  }]);

angular.module('themeBuilderApp')
  .directive('packs', function () {
    return {
      scope: {},
      replace: true,
      templateUrl: 'app/packs/packs.html',
      controller: function($scope, PacksStore, $modal, PacksActions) {
        PacksActions.init();

        $scope.packs = PacksStore.packs;
        $scope.$listenTo(PacksStore, 'packs.changed', function() {
          $scope.packs = PacksStore.packs;
        });
        $scope.install = function(pack) {
          PacksActions.install(pack);
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
            PacksActions.edit(theme);
          });
        };
        $scope.preview = function(pack) {
          var modalInstance = $modal.open({
            templateUrl: 'app/modal.carousel.html',
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
          modalInstance.result.then(function() {
          });
        };
      }
    };
  });


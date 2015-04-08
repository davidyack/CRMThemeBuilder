angular.module('app').
  factory('PacksResource', function($resource) {
    return $resource('/api/packs', null, {
        'update': { method:'PUT' }
    });
});

angular.module('app')
  .factory('PacksActions', function(flux, PacksResource) {
    var loaded = false;
    var loading = false;
    return {
      init: function() {
        if (!loaded && !loading) {
          loading = true;
          var data = PacksResource.query(function(data) {
            flux.dispatch('packsLoaded', data);
            loading = true;
            loaded = true;
          });
        }
      },
      edit: function(pack) {
        flux.dispatch('packUpdated', pack);
        PacksResource.update(pack, function(data) {
          flux.dispatch('packUpdated', data);
        });
      }
    };
  });

angular.module('app')
  .store('PacksStore', ['flux', '_', function(flux, _) {
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
    };
  }]);

angular.module('app')
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
          modalInstance.result.then(function(pack) {
          });
        };
      }
    };
  });

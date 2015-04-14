'use strict';

angular.module('themeBuilderApp')
  .factory('AlertsActions', function(flux, $timeout) {
    return {
      add: function(alert) {
        flux.dispatch('addAlert', alert);
        if (alert.timeout && alert.timeout > 0) {
          $timeout(function() {
            flux.dispatch('removeAlert', alert);
          }, alert.timeout);
        }
      },
      remove: function(alert) {
        flux.dispatch('removeAlert', alert);
      }
    };
  });

angular.module('themeBuilderApp')
  .store('AlertsStore', ['flux', '_', function(flux, _) {
    var state = flux.immutable({
      alerts: [],
    });
    return {
      handlers: {
        'addAlert': 'add',
        'removeAlert': 'remove'
      },
      add: function(alert) {
        alert.id = _.uniqueId('alert_');
        state = state.alerts.concat(alert);
        this.emitChange();
      },
      remove: function(alert) {
        var idx = _.findIndex(state.alerts, function(_alert) {
          return _alert.id === alert.id;
        });
        state = state.alerts.splice(idx, 1);
        this.emitChange();
      },
      exports: {
        get alerts() {
          return state.alerts;
        }
      }
    };
  }]);

angular.module('themeBuilderApp')
  .directive('infoblock', function() {
    return {
      scope: {},
      replace: true,
      template: '<div><alert ng-repeat="alert in alerts" ' +
        'type="{{alert.type}}" ' +
        'close="closeAlert(alert)">{{alert.msg}}</alert></div>',
      controller: function($scope, AlertsStore, AlertsActions) {
        $scope.alerts = AlertsStore.alerts;
        $scope.$listenTo(AlertsStore, function() {
          $scope.alerts = AlertsStore.alerts;
        });

        $scope.closeAlert = function(alert) {
          AlertsActions.remove(alert);
        };
      }
    };
  });



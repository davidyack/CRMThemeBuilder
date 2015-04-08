angular.module('app')
  .directive('navbar', function() {
    return {
      scope: {},
      replace: true,
      templateUrl: 'app/navbar/navbar.html',
      controller: function($scope, $modal, ThemesActions) {
        $scope.add = function() {
          var modalInstance = $modal.open({
            templateUrl: 'app/modal.theme.html',
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
        };
      }
    };
  });


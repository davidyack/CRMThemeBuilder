'use strict';

angular.module('themeBuilderApp')
  .directive('navbar', function(NavbarActions) {
    return {
      scope: {},
      replace: true,
      templateUrl: 'app/navbar/navbar.html',
      controller: function($scope, $modal, ThemesActions) {
        $scope.$watch('files', function () {
          NavbarActions.upload($scope.files);
        });
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

angular.module('themeBuilderApp')
  .factory('NavbarActions', function($upload) {
    return {
      upload: function(files) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            $upload.upload({
              url: 'api/themes/upload',
              file: file
            });
          }
        }
      }
    };
  });


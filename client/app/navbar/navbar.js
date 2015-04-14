'use strict';

angular.module('themeBuilderApp')
  .directive('navbar', function(NavbarActions) {
    var fileBtn = angular.element('<span class="btn btn-default btn-file">Upload<input type="file"></span>');
    return {
      scope: {},
      replace: true,
      templateUrl: 'app/navbar/navbar.html',
      link: function(scope, iElem) {
        iElem.children().append(fileBtn);
        fileBtn.children().bind('change', function() {
          NavbarActions.upload(this.files);
        });
      },
      controller: function($scope, $modal, ThemesActions) {
        //$scope.$watch('files', function () {
          //NavbarActions.upload($scope.files);
        //});
        $scope.upload = function(files) {
        },
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
  .factory('NavbarActions', function($window, $resource) {
    var ThemeUploadResource = $resource($window.ThemeBuilderThemesUploadURL || 'api/themes/upload');
    return {
      upload: function(files) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
              var data = JSON.parse(reader.result);
              ThemeUploadResource.save(data);
            });
            reader.readAsText(file);
          }
        }
      }
    };
  });


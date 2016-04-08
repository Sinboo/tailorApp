/**
 * Created by wxb on 16/1/8.
 */
'use strict';

angular.module('tailorApp')
  .controller('FillSizeModalCtrl', function ($scope) {
    if ($scope.ngDialogData.size) {
      $scope.size = $scope.ngDialogData.size;
    }
    else {
      $scope.size = {};
    }


  });

/**
 * Created by wxb on 16/4/21.
 */
'use strict';

angular.module('tailorApp')
  .controller('InputModalCtrl', function ($scope) {
    if ($scope.ngDialogData && $scope.ngDialogData.inputText) {
      $scope.inputText = $scope.ngDialogData.inputText;
    }
  });
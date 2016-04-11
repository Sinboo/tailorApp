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

    $scope.validate = function () {
      var flag;
      $.each($scope.size, function (key, value) {
        if (isNaN(value)) { flag = true}
      });
      if (flag) {layer.msg('填写的尺寸必须为数字,请检查!', {offset: 0, shift: 6}); return false;}
      return true;
    }



  });

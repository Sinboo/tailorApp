/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('UpdateProduceDateModalCtrl', function ($scope, ngDialog) {
    $scope.clothNum = $scope.ngDialogData.clothNum;
    $scope.dateList = $scope.ngDialogData.dateList;

    $scope.validate = function () {
      console.log($scope.dateList)
      var totalNum = 0;
      angular.forEach($scope.dateList, function (item) {
        var cnt = item.count == undefined ? 0 : item.count;
        totalNum = totalNum + cnt;
      });
      console.log(totalNum)

      if( totalNum != $scope.clothNum ) {
        layer.msg('安排生产的件数之和必须与订单总件数相等!', {offset: 0, shift: 6}); return false;
      }

      return true;
    }


  });

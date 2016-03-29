/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('SetProductStatusModalCtrl', function ($scope, FABRIC_UNIT) {
    $scope.FABRIC_UNIT = FABRIC_UNIT;
    $scope.modalData = {};

    $(document).on("click", ".setProductComintDate", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.setProductComintDate');
          input.val(date);
          input.trigger('input');
        }
      });
    })

    $scope.validate = function () {
      if($scope.ngDialogData.setStock && !$scope.modalData.stock) {layer.msg('请填写库存量.', {offset: 0, shift: 6}); return false;}
      if(!$scope.ngDialogData.setStock && !$scope.modalData.comingDate) {layer.msg('请填写预计到货时间.', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

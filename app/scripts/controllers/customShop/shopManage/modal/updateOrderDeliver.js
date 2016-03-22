/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('UpdateOrderDeliverModalCtrl', function ($scope, EXPRESS_COM) {
    $scope.formData = {};
    $scope.EXPRESS_COM = EXPRESS_COM;


    $(document).on("click", ".deliveryDate", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.deliveryDate');
          input.val(date);
          input.trigger('input');
        }
      });
    })

    $scope.validate = function () {
      if(!$scope.formData.company) {layer.msg('请填快递公司.', {offset: 0, shift: 6}); return false;}
      if(!$scope.formData.expressNumber) {layer.msg('请填写快递单号.', {offset: 0, shift: 6}); return false;}
      if(!$scope.formData.deliveryDate) {layer.msg('请填写实际交货日.', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

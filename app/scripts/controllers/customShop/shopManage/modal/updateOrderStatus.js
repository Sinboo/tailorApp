/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('UpdateOrderStatusModalCtrl', function ($scope) {
    $scope.formData = {};

    $(document).on("click", ".placeDate", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.placeDate');
          input.val(date);
          input.trigger('input');
        }
      });
    })

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
      if(!$scope.formData.placeDate) {layer.msg('请填下单日期.', {offset: 0, shift: 6}); return false;}
      if(!$scope.formData.deliveryDate) {layer.msg('请填写预计交货日期.', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

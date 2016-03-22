/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('InformClientModalCtrl', function ($scope) {
    $scope.formData = {};

    $(document).on("click", ".receiveDate", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.receiveDate');
          input.val(date);
          input.trigger('input');
        }
      });
    })


    $scope.validate = function () {
      if(!$scope.formData.receiveDate) {layer.msg('请填通知日期.', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

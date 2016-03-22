/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('TakeProductModalCtrl', function ($scope) {
    $scope.formData = {};

    $(document).on("click", ".takeAwayDate", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.takeAwayDate');
          input.val(date);
          input.trigger('input');
        }
      });
    })


    $scope.validate = function () {
      if(!$scope.formData.takeAwayDate) {layer.msg('请填取走日期.', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

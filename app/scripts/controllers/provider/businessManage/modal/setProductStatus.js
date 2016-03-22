/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('SetProductStatusModalCtrl', function ($scope, $timeout) {

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


  });

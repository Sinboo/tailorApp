/**
 * Created by wxb on 16/1/20.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddPriceSystemModalCtrl', function ($scope) {

    $scope.validate = function () {
      if(!$scope.modalData.name) {layer.msg('请填写价格体系名称.', {offset: 0, shift: 6}); return false;}
      return true;
    }



  })

/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('SendInfoModalCtrl', function ($scope, EXPRESS_COM) {
    $scope.modalData = {};

    $scope.expressComs = EXPRESS_COM;

    $scope.validate = function () {
      if (!$scope.modalData.company) {layer.msg('请选择快递公司', {offset: 0, shift: 6}); return false;}
      if (!$scope.modalData.number) {layer.msg('请填写快递单号', {offset: 0, shift: 6}); return false;}
      return true;
    }




  });

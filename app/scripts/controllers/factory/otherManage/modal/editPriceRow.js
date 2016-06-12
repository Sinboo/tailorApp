/**
 * Created by wxb on 16/1/8.
 */
'use strict';

angular.module('tailorApp')
  .controller('EditPriceRowModalCtrl', function ($scope, factoryService, tailoringTypes) {
    if ($scope.ngDialogData) {
      $scope.item = $scope.ngDialogData.item;
      if ($scope.item.clothingTypes) {
        $scope.item.tailoringType = $scope.item.clothingTypes=='OTHER'?$scope.item.otherClothes:tailoringTypes[$scope.item.clothingTypes.toString()];
      }
      $scope.STATUS = $scope.ngDialogData.STATUS;
      console.log($scope.item)
    }
    else {
      $scope.item = {};
    }

    $scope.getTailoringTypes = function(search) {
      var newTailoringTypes = $scope.tailoringTypes.slice();
      if (search && newTailoringTypes.indexOf(search) === -1) {
        newTailoringTypes.unshift(search);
      }
      return newTailoringTypes;
    };

    $scope.tailoringTypes = [
      '西服套装2ps(A+B)',
      '西服套装3ps(A+B+C)',
      '西服套装（A+2B）',
      '套装（A+C）',
      '套装（B+C）',
      '上衣A',
      '裤子B',
      '马甲C',
      '大衣E',
      '衬衫D',
      '礼服G',
      '夹克F'
    ];

    factoryService.getCrafts().then(function (data) {
      if (data && data.success == true) {
        if ($scope.STATUS == 'standard') {
          $scope.crafts = data.data.normalCrafts;
        }
        else if ($scope.STATUS == 'special') {
          $scope.crafts = data.data.specCrafts;
        }
      }
      else if (data && data.success == false) {
        toaster.pop('error', data.error.message);
      }
    });

    var beginDay = 1;
    $scope.days = [];
    for (var i = 0; i < 39 + 1; i++) {
      $scope.days.push(beginDay + i);
    }


    $scope.validate = function () {
      if($scope.STATUS == 'standard' && !$scope.item.tailoringType) {layer.msg('请选择定制项目', {offset: 0, shift: 6}); return false;}
      if(!$scope.item.craft) {layer.msg('请选择工艺类型', {offset: 0, shift: 6}); return false;}
      if($scope.STATUS == 'standard' && !$scope.item.days) {layer.msg('请选择工期天数', {offset: 0, shift: 6}); return false;}
      if(!$scope.item.price) {layer.msg('请输入价格', {offset: 0, shift: 6}); return false;}
      return true;
    };


  });

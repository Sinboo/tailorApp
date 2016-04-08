/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FillSizesCtrl', function ($scope, dataSetterGetter, $http, $state, toaster, ngDialog, factoryService, SPECIFICATION_GENDER, CUSTOMCLOTHING_TYPE, not_trousers_parts, trousers_parts) {
    $scope.item = dataSetterGetter.get('fillSizesInitData');
    console.log($scope.item);
    $scope.SPECIFICATION_GENDER = SPECIFICATION_GENDER;
    $scope.CUSTOMCLOTHING_TYPE = CUSTOMCLOTHING_TYPE;
    $scope.not_trousers_parts = not_trousers_parts;
    $scope.trousers_parts = trousers_parts;

    $scope.sizes = [];
    $scope.fillSize = function (size, index) {
      ngDialog.openConfirm({
        template: 'views/factory/otherManage/modal/fillSize.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'FillSizeModalCtrl',
        data: {
          item: $scope.item,
          not_trousers_parts: not_trousers_parts,
          trousers_parts: trousers_parts
        }
      }).then(
        function (value) {
          value.name = size;
          $scope.sizes.push(value);
          $scope.item.sizes.splice(index, 1);
        },
        function (value) {

        }
      )
    };

    $scope.editRow = function (size) {
      ngDialog.openConfirm({
        template: 'views/factory/otherManage/modal/fillSize.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'FillSizeModalCtrl',
        data: {
          item: $scope.item,
          size: size,
          not_trousers_parts: not_trousers_parts,
          trousers_parts: trousers_parts
        }
      })
    };

    $scope.deleteRow = function (sizeName, index) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此号型尺寸？'}
      }).then(
        function () {
          $scope.sizes.splice(index, 1);
          $scope.item.sizes.push(sizeName);
        },
        function () {

        }
      )
    }


    $scope.confirm = function () {
      
    }





    $scope.validate = function () {
      if(!$scope.item.gender) {layer.tips('请选择类别', '#_gender'); scrollTo('#_gender'); return false;}
      if(!$scope.item.clothing) {layer.tips('请选择类型', '#_clothing'); scrollTo('#_clothing'); return false;}
      if($scope.sizes.length == 0) {layer.tips('请新增至少一个号型', '#_setSize'); scrollTo('#_setSize'); return false;}
      return true;
    };
    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

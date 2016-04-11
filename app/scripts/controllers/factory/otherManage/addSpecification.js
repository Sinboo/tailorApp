/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddSpecificationCtrl', function ($scope, dataSetterGetter, $http, $state, toaster, ngDialog, factoryService, SPECIFICATION_GENDER, CUSTOMCLOTHING_TYPE, not_trousers_parts, trousers_parts) {
    $scope.item = {};
    $scope.flag = false;

    $scope.genders = [];
    $.each(SPECIFICATION_GENDER, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.genders.push(typeItem);
    });

    $scope.clothings = [];
    $.each(CUSTOMCLOTHING_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.clothings.push(typeItem);
    });

    $scope.not_trousers_parts = [];
    $.each(not_trousers_parts, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.not_trousers_parts.push(typeItem);
    });

    $scope.trousers_parts = [];
    $.each(trousers_parts, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.trousers_parts.push(typeItem);
    });

    $scope.setFlag = function (clothing) {
      $scope.item.part = [];
      $scope.item.flag = clothing == 'JEANS';
    };
    
    $scope.choose = function () {
      console.log($scope.item.part)
    };

    $scope.item.sizes = [];
    $scope.addSize = function () {
      ngDialog.openConfirm({
        template: 'views/factory/otherManage/modal/addSize.html',
        className: 'ngdialog-theme-default dialogcaseeditor'
      }).then(
        function (value) {
          $scope.item.sizes.push(value);
          console.log($scope.sizes)
        },
        function (value) {

        }
      )
    };

    $scope.deleteSize = function (index) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此号型？'}
      }).then(
        function (value) {
          $scope.item.sizes.splice(index, 1);
        },
        function (value) {

        }
      )
    };
    
    $scope.confirm = function (item) {
      dataSetterGetter.set('fillSizesInitData', item)
      $state.go('factory.otherManage.fillSizes')
    };





    $scope.validate = function () {
      if(!$scope.item.gender) {layer.tips('请选择类别', '#_gender'); scrollTo('#_gender'); return false;}
      if(!$scope.item.clothing) {layer.tips('请选择类型', '#_clothing'); scrollTo('#_clothing'); return false;}
      if(!$scope.item.name) {layer.tips('请输入规格单名称', '#_specificationName'); scrollTo('#_specificationName'); return false;}
      if($scope.item.sizes.length == 0) {layer.tips('请新增至少一个号型', '#_setSize'); scrollTo('#_setSize'); return false;}
      return true;
    };
    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FillSizesCtrl', function ($scope, dataSetterGetter, $http, $state, toaster, ngDialog, factoryService, SPECIFICATION_GENDER, specification_clothing_type, not_trousers_parts, trousers_parts) {
    $scope.item = dataSetterGetter.get('fillSizesInitData');
    console.log($scope.item);
    $scope.SPECIFICATION_GENDER = SPECIFICATION_GENDER;
    $scope.specification_clothing_type = specification_clothing_type;
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
      console.log($scope.item);
      console.log($scope.sizes);
      var postData = {};
      postData.clothing = $scope.item.clothing;
      postData.gender = $scope.item.gender;
      postData.name = $scope.item.name;
      postData.remark = $scope.item.remark;
      postData.standard = {};
      angular.forEach($scope.item.part, function (item) {
        postData[item] = true;
      });
      angular.forEach($scope.sizes, function (item) {
        postData.standard[item.name] = {};
        $.each(item, function (key, value) {
          if (key !== 'name') {
            postData.standard[item.name][key] = value;
          }
        })
      });
      var post = JSON.parse(JSON.stringify(postData));
      console.log(post);
      factoryService.addSpecification(post).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '添加规格单成功!');
          $state.go('factory.otherManage.viewSpecification');
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      })
    };


    $scope.validate = function () {
      if($scope.sizes.length == 0) {layer.tips('请填写至少一个号型详情', '#_setSize'); scrollTo('#_setSize'); return false;}
      return true;
    };
    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

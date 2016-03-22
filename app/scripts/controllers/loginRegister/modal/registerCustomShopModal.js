/**
 * Created by wxb on 16/1/8.
 */
'use strict';

angular.module('tailorApp')
  .controller('RegisterCustomShopModalCtrl', function ($scope, CUSTOMCLOTHING_TYPE, SHOP_TYPE) {
    $scope.setProvince = function (province) {
      $scope.formData.province = province;
    }
    $scope.setCity = function (city) {
      $scope.formData.city = city;
    }

    $scope.businesses = [];
    $.each(CUSTOMCLOTHING_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.businesses.push(typeItem);
    });

    $scope.shopTypes = [];
    $.each(SHOP_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.shopTypes.push(typeItem);
    });

    $scope.formData.business = [];

    $scope.validate = function () {
      var r = valid();
      if (r) {
        var submitData = {};
        $.each($scope.formData, function (key, value) {
          if (key == 'province') {
            submitData.province = value.name;
            submitData.provinceNumber = value.number;
          }
          else if (key == 'city') {
            submitData.city = value.name;
            submitData.cityNumber = value.number;
          }
          else {
            submitData[key] = value;
          }
        });
        console.log(submitData);
        $scope.submitData = submitData;
        $scope.checkPass = true;
      }
    };

    var valid = function() {
      if (!$scope.formData.province) {layer.msg('请选择省份', {offset: 0, shift: 6}); return false;}
      if (!$scope.formData.city) {layer.msg('请选择城市/区', {offset: 0, shift: 6}); return false;}
      if (!$scope.formData.address) {layer.msg('请填写地址', {offset: 0, shift: 6}); return false;}
      if (!$scope.formData.merchantName) {layer.msg('请填写单位名称', {offset: 0, shift: 6}); return false;}
      if (!$scope.formData.shopType) {layer.msg('请填写单位类型', {offset: 0, shift: 6}); return false;}
      if ($scope.formData.business.length == 0) {layer.msg('请选择定制服装类型', {offset: 0, shift: 6}); return false;}
      if (!$scope.formData.contact) {layer.msg('请填写联系人', {offset: 0, shift: 6}); return false;}
      if (!regMobile($scope.formData.phone)) {layer.msg('请填写正确的联系电话', {offset: 0, shift: 6}); return false;}

      return true;
    };

    var regMobile = function(mobile) {
      return RegExp(/^0?(17[6-7]|13[0-9]|15[0-9]|18[02356789]|14[57])[0-9]{8}$/).test(mobile)
    }




  })

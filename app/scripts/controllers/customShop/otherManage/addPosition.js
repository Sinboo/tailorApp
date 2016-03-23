/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddPositionCtrl', function ($scope, baseService, $state, localStorageService, customShopService, toaster, commonService) {
    $scope.divisions = localStorageService.get('divisions');
    if (!$scope.divisions) {
      baseService.getDivision().then(function (data) {
        if (data && data.data.length>0) {
          $scope.divisions = data.data;
          localStorageService.set('divisions', data.data);
        }
      });
    }

    $scope.formData = {};
    $scope.setProvince = function (province) {
      $scope.formData.province = province;
    };
    $scope.setCity = function (city) {
      $scope.formData.city = city;
    };

    $scope.savePosition = function (type) {
      var positionType = type;
      var postData = {};
      $.each($scope.formData, function (key, value) {
        if (key == 'province') {
          postData.province = value.name;
          postData.provinceNumber = value.number;
        }
        else if (key == 'city') {
          postData.city = value.name;
          postData.cityNumber = value.number;
        }
        else {
          postData[key] = value;
        }
      });

      if (type == 'myAddress') {
        postData.type = 1;
        positionType = 'address';
      }
      if (type == 'other') {
        postData.type = 2;
        positionType = 'address';
      }

      customShopService.addPosition(postData, positionType).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '地址添加成功！');
          $state.go('tailor.otherManage.positionManage', {type: positionType});
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message );
        }
        else {
          toaster.pop('error', '添加地址失败!');
        }
      })
    };


    $scope.validate = function () {
      if(!$scope.formData.province) {layer.tips('请选择省或直辖市', '#_setProvince'); scrollTo('#_setProvince'); return false;}
      if(!$scope.formData.city) {layer.tips('请选择城市或地区', '#_setCity'); scrollTo('#_setCity'); return false;}
      if(!$scope.formData.address) {layer.tips('请输入具体地址', '#_address'); scrollTo('#_address'); return false;}
      if(!$scope.formData.shortName) {layer.tips('请输入单位简称', '#_shortName'); scrollTo('#_shortName'); return false;}
      if(!$scope.formData.providerType) {layer.tips('请输入单位简称', '#_providerType'); scrollTo('#_providerType'); return false;}
      if(!$scope.formData.contact) {layer.tips('请输入联系人', '#_contact'); scrollTo('#_contact'); return false;}
      if(!(commonService.regMobile($scope.formData.phone) || commonService.regTel($scope.formData.phone))) {layer.tips('输入的联系电话格式有误，请参照格式：010-5983163或13400693163', '#_phone'); scrollTo('#_phone'); return false;}
      return true;
    };

    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};

  });

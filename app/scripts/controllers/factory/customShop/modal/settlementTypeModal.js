/**
 * Created by wxb on 16/1/8.
 */
'use strict';

angular.module('tailorApp')
  .controller('FactorySettlementTypeModalCtrl', function ($scope, factoryService, FACTORY_SETTLEMENT_TYPE) {
    $scope.formData = {};
    $scope.businesses = [];
    $.each(FACTORY_SETTLEMENT_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.businesses.push(typeItem);
    });

    $scope.formData.settlementType = [];
    $scope.choose = function (business) {
      if ($scope.formData.settlementType.indexOf(business) === -1) {
        $scope.formData.settlementType = [];
        $scope.formData.settlementType.push(business.shortName);
      }
      else {
        $scope.formData.settlementType.pop();
      }
    };

    //factoryService.getPriceSystems().then(function (priceSystems) {
    //  $scope.priceSystems = priceSystems.data;
    //  $scope.priceSystems.push({name: '零剪价格'})
    //});

    $scope.formData.pricingPackageNumber = [];
    $scope.choosePrice = function (ps) {
      if ($scope.formData.pricingPackageNumber.indexOf(ps) === -1) {
        $scope.formData.pricingPackageNumber = [];
        $scope.formData.pricingPackageNumber.push(ps.number);
      }
      else {
        $scope.formData.pricingPackageNumber.pop();
      }
    };

    $scope.ExpressProcesses = [{fullName: '需要处理运费', shortName: true}, {fullName: '不需要处理运费', shortName: false}];
    $scope.formData.hasExpressProcess = [];
    $scope.chooseExpressProcess = function (ExpressProcess) {
      if ($scope.formData.hasExpressProcess.indexOf(ExpressProcess) === -1) {
        $scope.formData.hasExpressProcess = [];
        $scope.formData.hasExpressProcess.push(ExpressProcess.shortName);
      }
      else {
        $scope.formData.hasExpressProcess.pop();
      }
      console.log($scope.formData.hasExpressProcess)
    };

    $scope.validate = function () {
      //if ($scope.formData.pricingPackageNumber.length === 0) {{layer.msg('请选择结算价格', {offset: 0, shift: 6}); return false;}}
      if ($scope.formData.settlementType.length === 0) {{layer.msg('请选择结算方式', {offset: 0, shift: 6}); return false;}}
      //if ($scope.formData.hasExpressProcess.length === 0) {{layer.msg('请选择订单运费', {offset: 0, shift: 6}); return false;}}
      return true;
    }


  })

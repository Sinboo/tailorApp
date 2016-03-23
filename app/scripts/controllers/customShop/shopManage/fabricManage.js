/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FabricManageCtrl', function ($scope, customShopService, $stateParams, commonService, CLOTHING_TOBUY, FABRIC_UNIT, tailoringTypes) {
    $scope.tailoringTypes = tailoringTypes;
    $scope.FABRIC_UNIT = FABRIC_UNIT;

    $scope.CLOTHING_TYPE = {D: '衬衫', A: '西服', OTHER: '其他'}
    $scope.clothingType = $stateParams.clothingType;
    $scope.clothingToBuy = CLOTHING_TOBUY[$stateParams.clothingType];
    customShopService.unPurchaseOrder($stateParams.clothingType).then(function (data) {
      $scope.fabricCount = Object.keys(data.data).length;
      $scope.fabricList = [];
      $.each(data.data, function (key, value) {
        var fabric = {}
        fabric.supplierNumber = key;
        fabric.orderList = value;
        angular.forEach(fabric.orderList, function (item) {
          item.createDate = commonService.convertDate(item.createTime);
          item.deliveryDate = commonService.convertDate(item.orderItem.deliveryDate);
          item.factoryNum = item.orderItem.factoryNumber;
          fabric.supplierName = item.supplierName;
        });
        fabric.orderList = _.groupBy(fabric.orderList, 'factoryNum');
        fabric.factoryList = Object.keys(fabric.orderList);
        $scope.fabricList.push(fabric);
      })
      console.log($scope.fabricList);
    })

  })

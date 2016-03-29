/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('OrderManageCtrl', function ($scope, $stateParams, ngDialog, toaster, $state, customShopService, PAGE_SIZE, commonService, ORDER_MANAGE, customShop_OrderType) {
    $scope.customShop_OrderType = customShop_OrderType;
    $scope.ORDER_MANAGE = ORDER_MANAGE;
    $scope.STATUS = $stateParams.STATUS;

    var param = {};
    param.page = 0;
    param.pageSize = PAGE_SIZE;
    param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;

    var queryParams = JSON.parse(JSON.stringify(param));
    customShopService.fabricOrders(queryParams).then(function (data) {
      initData(queryParams, data.data)
    });

    var initData = function (param, data) {
      $scope.orders = data.content;
      $scope.total = data.totalElements;
      console.log($scope.orders);

      $scope.bigTotalItems = data.totalElements;
      $scope.maxSize = 10;
      $scope.perPages = 20;
      $scope.bigCurrentPage = param.page + 1 || 1;
    };

    $scope.changeFn = function (key, value) {
      if (key === 'page') {
        param[key] = $scope.bigCurrentPage - 1;
      } else {
        param[key] = value == "" ? undefined : value;
      }
      var queryParams = JSON.parse(JSON.stringify(param))
      customShopService.fabricOrders(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };

    $scope.confirmReceived = function (order) {
      ngDialog.openConfirm({
        template: 'views/customShop/shopManage/modal/confirmReceivedModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'ConfirmReceivedModalCtrl',
        data: order
      }).then(
        function(value) {
          customShopService.receiveOrder(order.number).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '添加确认成功!');
              var queryParams = JSON.parse(JSON.stringify(param));
              customShopService.fabricOrders(queryParams).then(function(data){
                initData(queryParams, data.data)
              });
            }
            else if (data && data.success == false) {
              toaster.pop('warning', data.error.message);
            }
          })
        },
        function (value) {

        }
      );

    };

    $scope.confirmExpressFee = function (order) {
      var factoryList = [];
      factoryList.push(order.factoryNumber)
      //ui-sref="tailor.shopManage.buyFabric({supplierName: fabric.supplierName, supplierNumber: fabric.supplierNumber, factoryName: fabric.orderList[factory][0].orderItem.factoryName, clothingType: clothingType, factoryNum: factory, orderList: fabric.orderList[factory]})" style="margin-bottom: 40px">
      $state.go('tailor.shopManage.buyFabric',
        {supplierName: order.supplierName, supplierNumber: order.supplierNumber,
        factoryName: order.items[0].orderItem.factoryName, factoryNum: factoryList,
        orderList: order.items, expressFeeStatus: 'true', remark: order.remark,
        orderNumber: order.number, expressFee: order.expressFee,
        fabricFee: order.fabricFee, totalPrice4CNY: order.totalPrice4CNY, totalPrice: order.totalPrice})
    }

    $scope.queryExpress = commonService.queryExpress;


  })

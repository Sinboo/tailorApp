/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProduceOrderCtrl', function ($scope, $state, $stateParams, ngDialog, commonService, PAGE_SIZE, factoryService, toaster, tailoringTypes) {
    $scope.tailoringTypes = tailoringTypes;
    $scope.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
    $scope.PRODUCE_STATUS = {PLACED: '待下单', PRODUCE: '生产中', DELIVERED: '已发货', SUCCESS: '交易成功'};

    var param = {};
    param.page = 0;
    param.pageSize = PAGE_SIZE;
    param.status = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
    var queryParams = JSON.parse(JSON.stringify(param));
    factoryService.produceOrders(queryParams).then(function (data) {
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
      customShopService.produceRecords(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };

    $scope.updateOrder = function (number) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/updateOrderStatus.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'UpdateOrderStatusModalCtrl'
      }).then(function (value) {
        var parameter = value;
        parameter.NUMBER = number;
        parameter = JSON.parse(JSON.stringify(parameter));
        console.log(parameter)
        customShopService.placeProduce(parameter).then(function (data) {
          if(data && data.success == true) {
            toaster.pop('success', '订单更新成功！');
            var queryParams = JSON.parse(JSON.stringify(param))
            customShopService.produceRecords(queryParams).then(function(data){
              initData(queryParams, data.data)
            });
          }
          else if (data && data.error) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function(value) {

      })
    }

    $scope.updateOrderDeliver = function (number) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/updateOrderDeliver.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'UpdateOrderDeliverModalCtrl'
      }).then(function (value) {
        var parameter = value;
        parameter.NUMBER = number;
        parameter = JSON.parse(JSON.stringify(parameter));
        console.log(parameter)
        customShopService.deliveryProduce(parameter).then(function (data) {
          if(data && data.success == true) {
            toaster.pop('success', '订单更新成功！');
            var queryParams = JSON.parse(JSON.stringify(param))
            customShopService.produceRecords(queryParams).then(function(data){
              initData(queryParams, data.data)
            });
          }
          else if (data && data.error) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function(value) {

      })
    };

    $scope.confirmSize = function (order) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/confirmSizeModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'ConfirmSizeModalCtrl',
        data: {order: order}
      }).then(function (value) {
        console.log(value);
        var param = {};
        //param.NUMBER = order.number;
        param.bodySize = {};
        param.bodySize.lowerBody  = order.bodySize.lowerBody;
        param.bodySize.upperBody  = order.bodySize.upperBody;
        param.produceDetails = value;
        param = JSON.parse(JSON.stringify(param));
        console.log(param);
        customShopService.confirmSize(param, order.number).then(function (data) {
          if(data && data.success == true) {
            toaster.pop('success', '确认尺寸成功！');
            var queryParams = JSON.parse(JSON.stringify(param))
            customShopService.produceRecords(queryParams).then(function(data){
              initData(queryParams, data.data)
            });
          }
          else if (data && data.error) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function (value) {

      })
    };

    $scope.previewOrder = function (order) {
      $state.go('previewProduceOrder', {isFactory: 'factory', order: order}, {inherit: false});
    };

    $scope.queryExpress = commonService.queryExpress;

  });

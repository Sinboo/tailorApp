/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProductionRecordCtrl', function ($scope, $state, $stateParams, ngDialog, commonService, PRODUCE_STATUS, PAGE_SIZE, customShopService, toaster, tailoringTypes) {
    $scope.tailoringTypes = tailoringTypes;
    $scope.PRODUCE_STATUS = PRODUCE_STATUS;
    $scope.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;

    var param = {};
    param.page = 0;
    param.pageSize = PAGE_SIZE;
    param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
    param.clothingType = $stateParams.clothingType == "" ? undefined : $stateParams.clothingType;
    var queryParams = JSON.parse(JSON.stringify(param));
    customShopService.produceRecords(queryParams).then(function (data) {
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
        var parameters = {};
        parameters.bodySize = {};
        parameters.bodySize.lowerBody  = order.bodySize.lowerBody;
        parameters.bodySize.upperBody  = order.bodySize.upperBody;
        parameters.produceDetails = value;
        parameters = JSON.parse(JSON.stringify(parameters));
        console.log(parameters);
        customShopService.confirmSize(parameters, order.number).then(function (data) {
          if(data && data.success == true) {
            toaster.pop('success', '确认尺寸成功！');
            var queryParams = JSON.parse(JSON.stringify(param));
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
      $state.go('previewProduceOrder', {order: order}, {inherit: false});
    };

    $scope.queryExpress = commonService.queryExpress;

  });

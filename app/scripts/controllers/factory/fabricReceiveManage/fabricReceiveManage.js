/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FabricReceiveManageCtrl', function ($scope, dataSetterGetter, $stateParams, factoryService, ngDialog, toaster, commonService, PAGE_SIZE, FABRIC_RECEIVE_STATUS) {
    $scope.FABRIC_RECEIVE_STATUS = FABRIC_RECEIVE_STATUS;
    $scope.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;

    var param = {};
    param.page = 0;
    param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
    param.pageSize = PAGE_SIZE;
    var queryParams = JSON.parse(JSON.stringify(param));
    factoryService.fabrics(queryParams).then(function(data){
      initData(queryParams, data.data)
    });


    var initData = function (param, data) {
      $scope.orders = data.content;
      $scope.total = data.totalElements;

      $scope.bigTotalItems = data.totalElements;
      $scope.maxSize = 10;
      $scope.perPages = PAGE_SIZE;
      $scope.bigCurrentPage = param.page + 1 || 1;
    };

    $scope.changeFn = function (key, value) {
      if (key === 'page') {
        param[key] = $scope.bigCurrentPage - 1;
      } else {
        param[key] = value == "" ? undefined : value;
      }
      var queryParams = JSON.parse(JSON.stringify(param));
      factoryService.fabrics(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };
    
    $scope.receiveFabric = function (order) {
      ngDialog.openConfirm({
        template: 'views/customShop/shopManage/modal/confirmReceivedModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'ConfirmReceivedModalCtrl',
        data: {order: order, detailFlag: false}
      }).then(
        function(value) {
          factoryService.receiveFabric(order.number).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '确认收货成功！');
              var queryParams = JSON.parse(JSON.stringify(param));
              factoryService.fabrics(queryParams).then(function(data){
                initData(queryParams, data.data)
              });
            }
          })
        },
        function (value) {

        }
      )
    };

    $scope.showOrderDetail = function (order) {
      ngDialog.openConfirm({
        template: 'views/customShop/shopManage/modal/confirmReceivedModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'ConfirmReceivedModalCtrl',
        data: {order: order, detailFlag: true}
      })
    };

    $scope.queryExpress = commonService.queryExpress;

  });










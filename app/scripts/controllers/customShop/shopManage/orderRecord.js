/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('OrderRecordCtrl', function ($scope, $state, $stateParams, customShopService, ngDialog, toaster, PAGE_SIZE, tailoringTypes) {
    $scope.tailoringTypes = tailoringTypes;
    $scope.Math = Math;

    var param = {};
    param.page = 0;
    param.pageSize = PAGE_SIZE;
    param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
    var queryParams = JSON.parse(JSON.stringify(param));
    customShopService.getOrders(queryParams).then(function (data) {
      initData(queryParams, data.data)
    });

    var initData = function (param, data) {
      $scope.orders = data.content;
      $scope.total = data.totalElements;

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
      var queryParams = JSON.parse(JSON.stringify(param));
      customShopService.getOrders(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };

    $scope.editOrder = function (order) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '修改此订单？'}
      }).then(
        function () {
          //dataSetterGetter.set('editOrderInitData', order)
          $state.go('tailor.shopManage.addOrderRecord', {ID: order.number})
        },
        function () {

        }
      )
    }

    $scope.deleteOrder = function (ID) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '删除此订单？'}
      }).then(
        function () {
          customShopService.deleteOrder(ID).then(function (data) {
            if (data && data.success == true) {
              var queryParams = JSON.parse(JSON.stringify(param));
              customShopService.getOrders(queryParams).then(function (data) {
                initData(queryParams, data.data)
              });
              toaster.pop('success', '删除订单成功!');
            }
            else if (data && data.success == false) {
              toaster.pop('error', data.error.message);
            }
          })
        },
        function () {

        }
      )
    }


  });

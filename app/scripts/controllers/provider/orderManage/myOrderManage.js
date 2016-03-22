/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('MyOrderManageCtrl', function ($scope, dataSetterGetter, $stateParams, providerService, commonService, PAGE_SIZE, ORDER_STATUS) {
    $scope.ORDER_STATUS = ORDER_STATUS;
    $scope.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;

    var param = {};
    param.page = 0;
    param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
    param.pageSize = PAGE_SIZE;
    var queryParams = JSON.parse(JSON.stringify(param));
    providerService.getOrders(queryParams).then(function(data){
      initData(queryParams, data.data)
    });


    var initData = function (param, data) {
      $scope.orders = data.content;
      $scope.total = data.totalElements;
      dataSetterGetter.set('orderNum', data.totalElements);
      dataSetterGetter.set('STATUS', $scope.STATUS);

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
      providerService.getOrders(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };

    $scope.queryExpress = commonService.queryExpress;

  })










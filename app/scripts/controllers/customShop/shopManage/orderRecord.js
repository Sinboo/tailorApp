/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('OrderRecordCtrl', function ($scope, $stateParams, customShopService, PAGE_SIZE, tailoringTypes) {
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


  })

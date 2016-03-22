/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('BoughtFabricCtrl', function ($scope, PAGE_SIZE, customShopService, commonService) {
    $scope.covertDate = commonService.convertDate;

    var param = {};
    param.page = 1;
    param.pageSize = PAGE_SIZE;
    param = JSON.parse(JSON.stringify(param));

    customShopService.purchaseOrder(param).then(function (data) {
      initData(param, data.data)
    })

    var initData = function (param, data) {
      $scope.orders = data.content;
      $scope.total = data.totalElements;

      $scope.bigTotalItems = data.totalElements;
      $scope.maxSize = 10;
      $scope.perPages = 20;
      $scope.bigCurrentPage = param.page || 1;
    };

    $scope.changeFn = function (key, value) {
      if (key === 'page') {
        param[key] = $scope.bigCurrentPage;
      } else {
        param[key] = value == "" ? undefined : value;
      }
      //console.log(param);
      param = JSON.parse(JSON.stringify(param))
      customShopService.purchaseOrder(param).then(function(data){
        initData(param, data.data)
      });
    };





  })

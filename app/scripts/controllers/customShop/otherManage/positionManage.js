/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('PositionManageCtrl', function ($scope, $stateParams, customShopService, PAGE_SIZE, PROVIDER_TYPE) {
    $scope.PRODUCE_STATUS = PROVIDER_TYPE;
    $scope.type = $stateParams.type;
    $scope.addressType = $stateParams.addressType;
    $scope.ADDRESSTYPE = {1: '我的', 2: '其他'};


    var param = {};
    param.page = 0;
    param.type = $stateParams.type == "" ? undefined : $stateParams.type;
    param.addressType = $stateParams.addressType == "" ? undefined : $stateParams.addressType;
    param.pageSize = PAGE_SIZE;

    var queryParams = JSON.parse(JSON.stringify(param));
    customShopService.getPositions(queryParams).then(function(data){
      initData(queryParams, data.data)
    });


    var initData = function (param, data) {
      $scope.positions = data.content;
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
      var queryParams = JSON.parse(JSON.stringify(param))
      customShopService.getPositions(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };
  })

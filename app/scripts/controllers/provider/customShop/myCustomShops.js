/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('MyCustomShopsCtrl', function ($scope, localStorageService, $stateParams, providerService, baseService, newApplyCount, PAGE_SIZE, SHOP_TYPE) {
    $scope.SHOP_TYPE = SHOP_TYPE;

    $scope.divisions = localStorageService.get('divisions');
    if (!$scope.divisions) {
      baseService.getDivision().then(function (data) {
        if (data && data.data.length>0) {
          $scope.divisions = data.data;
          localStorageService.set('divisions', data.data);
        }
      });
    }

    $scope.newApplyCount = newApplyCount.data.newApply;

    var param = {};
    param.page = 0;
    param.shopType = $stateParams.business == "" ? undefined : $stateParams.business;
    param.pageSize = PAGE_SIZE;
    var queryParams = JSON.parse(JSON.stringify(param));
    providerService.getAllPartners(queryParams).then(function(data){
      initData(queryParams, data.data)
      console.log($scope.shops)
    });


    var initData = function (param, data) {
      $scope.shops = data.content;
      angular.forEach($scope.shops, function (item) {
        item.dropDown = [];
        item.dropDown.push(item);
      })

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
      providerService.getAllPartners(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };


    $scope.quickQuery = function (shopKeywords) {
      if (!shopKeywords || $.trim(shopKeywords)=="") {
        layer.msg('请输入品牌名.', {offset: 0, shift: 6}); return;
      }
      $scope.quickQueryShow = true;
      providerService.searchPartner(shopKeywords).then(function (data) {
        $scope.d = data.data[0];
      })
    };

    $scope.quickQueryConfirm = function () {
      $scope.quickQueryShow = false;
    };

  })










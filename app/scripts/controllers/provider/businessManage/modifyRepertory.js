/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ModifyRepertoryCtrl', function ($scope, providerService, toaster) {
    $scope.quickQueryProduct = function (productNumber, color) {
      $scope.quickQueryShow = true;
      var queryParams = {};
      queryParams.productNumber = productNumber == "" ? undefined : productNumber;
      queryParams.color = color == "" ? undefined : color;
      queryParams = JSON.parse(JSON.stringify(queryParams));
      providerService.quickQueryProduct(queryParams).then(function (data) {
        $scope.queriedProducts = data.data;
        angular.forEach($scope.queriedProducts, function (item) {
          item.showStock = item.stock;
        })
      });
    };

    $scope.setProductStatus = function (product, index) {
      var queryParams = {};
      queryParams.productNumber = product.number;
      queryParams.stock = product.showStock == "" ? undefined : product.showStock;
      queryParams = JSON.parse(JSON.stringify(queryParams));
      providerService.setRepertory(queryParams).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', ' 库存修改成功！');
          $scope.queriedProducts.splice(index, 1);
        }
      })
    };



  })

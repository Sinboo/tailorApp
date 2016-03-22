/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('OutStockManageCtrl', function ($scope, providerService, SALES_STATUS, toaster) {
    $scope.SALES_STATUS = SALES_STATUS;
    $scope.quickQueryProduct = function (productNumber, color) {
      $scope.quickQueryShow = true;
      var queryParams = {};
      queryParams.productNumber = productNumber == "" ? undefined : productNumber;
      queryParams.color = color == "" ? undefined : color;
      queryParams = JSON.parse(JSON.stringify(queryParams));
      providerService.quickQueryProduct(queryParams).then(function (data) {
        $scope.queriedProducts = data.data;
      });
    };

    $scope.setProductStatus = function (product, index) {
      providerService.setOutStock(product.number).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', ' 断货登记成功！');
          $scope.queriedProducts.splice(index, 1);
          providerService.getOutStockProducts().then(function (data) {
            $scope.outStockProducts = data.data;
          });
        }
      })
    };

    providerService.getOutStockProducts().then(function (data) {
      $scope.outStockProducts = data.data;
    });





  });

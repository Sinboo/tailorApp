/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('StockManageCtrl', function ($scope, providerService, ngDialog, commonService, toaster) {
    $scope.quickQueryProduct = function (productNumber, color) {
      $scope.quickQueryShow = true;
      var queryParams = {};
      queryParams.productNumber = productNumber == "" ? undefined : productNumber;
      queryParams.color = color == "" ? undefined : color;
      queryParams = JSON.parse(JSON.stringify(queryParams));
      console.log(queryParams)
      providerService.quickQueryProduct(queryParams).then(function (data) {
        $scope.queriedProducts = data.data;
      })
    };

    $scope.setProductStatus = function (product, index) {
      var ngDialogData = {
        product: product
        //comingDateOptions: {minDate: new Date()}
      };

      //var dialog = ngDialog.open({
      //  template: 'views/provider/businessManage/modal/setProductStatus.html',
      //  className: 'ngdialog-theme-default dialogcaseeditor',
      //  controller: 'SetProductStatusModalCtrl',
      //  data: ngDialogData
      //})
      //
      //dialog.closePromise.then(function (data) {
      //  console.log(data.value);
      //
      //})

      ngDialog.openConfirm({
        template: 'views/provider/businessManage/modal/setProductStatus.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'SetProductStatusModalCtrl',
        data: ngDialogData
      }).then(
        function(value) {
          console.log(value)
          console.log($scope.modalComingDate);
          if (!value || value == "") {
            toaster.pop('error', ' 预计到货时间不能为空！');
            return;
          }
          var deliveryDate = commonService.convertDate(value);
          var queryParams = {};
          queryParams.productNumber = product.number;
          queryParams.deliveryDate = deliveryDate;
          providerService.setStock(queryParams).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', ' 缺货登记成功！');
              $scope.queriedProducts.splice(index, 1);
              providerService.getStockProducts().then(function (data) {
                $scope.stockProducts = data.data;
              });
            }
          });
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };

    providerService.getStockProducts().then(function (data) {
      $scope.stockProducts = data.data;
    });

  })

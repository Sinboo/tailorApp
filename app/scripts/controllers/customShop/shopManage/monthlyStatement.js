/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ShopMonthlyStatementCtrl', function ($scope, $stateParams, customShopService, ngDialog, toaster) {
    $scope.STATUS = $stateParams.billType == "" ? undefined : $stateParams.billType;

    var params = {};
    params.STATUS = $stateParams.billType == "" ? undefined : $stateParams.billType;
    params = JSON.parse(JSON.stringify(params));
    customShopService.getBills(params).then(function (data) {
      $scope.bills = data.data;
    });



    $scope.sendPayment = function (bill) {
      customShopService.payment(bill.supplierNumber).then(function (data) {
        var payment = data.data;
        var ngDialogData = {
          payment: payment,
          bill: bill
        };
        console.log(payment)

        ngDialog.openConfirm({
          template: "views/customShop/shopManage/modal/sendPaymentModal.html",
          className: 'ngdialog-theme-default dialogcaseeditor',
          controller: 'SendPaymentModalCtrl',
          data: ngDialogData
        }).then(function (value) {
          console.log(value)
          var param = {};
          param.voucherUrl = value.url;
          param.NUMBER = bill.number;
          customShopService.uploadPaymentImg(param).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '上传付款凭证成功!');
              params.STATUS = $stateParams.billType == "" ? undefined : $stateParams.billType;
              params = JSON.parse(JSON.stringify(params));
              customShopService.getBills(params).then(function (data) {
                $scope.bills = data.data;
              });
            }
          })

        }, function (value) {

        })
      })

    }

  })










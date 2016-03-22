/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('MonthlyStatementCtrl', function ($scope, $stateParams, providerService, toaster) {
    $scope.STATUS = $stateParams.billType == "" ? undefined : $stateParams.billType;

    var params = {};
    params.STATUS = $stateParams.billType == "" ? undefined : $stateParams.billType;
    params = JSON.parse(JSON.stringify(params));
    providerService.getBills(params).then(function (data) {
      $scope.bills = data.data;
    })

    $scope.deliverBill = function (NUMBER) {
      providerService.deliverBill(NUMBER).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '发送对账单成功!')
          params.STATUS = $stateParams.billType == "" ? undefined : $stateParams.billType;
          params = JSON.parse(JSON.stringify(params));
          providerService.getBills(params).then(function (data) {
            $scope.bills = data.data;
          })
        }
        else if (data && data.error) {
          toaster.pop('warning', data.error.message);
        }
      })
    }

    $scope.confirmBill = function (NUMBER) {
      providerService.confirmBill(NUMBER).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '确认收款成功!')
          params.STATUS = $stateParams.billType == "" ? undefined : $stateParams.billType;
          params = JSON.parse(JSON.stringify(params));
          providerService.getBills(params).then(function (data) {
            $scope.bills = data.data;
          })
        }
        else if (data && data.error) {
          toaster.pop('warning', data.error.message);
        }
      })
    }



  })










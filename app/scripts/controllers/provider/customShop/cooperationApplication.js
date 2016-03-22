/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('CooperationApplicationCtrl', function ($scope, ngDialog, providerService, SHOP_TYPE, toaster) {
    providerService.newApplyCount().then(function (data) {
      $scope.newApplyCount = data.data.newApply;
    })
    providerService.newApplies().then(function (data) {
      $scope.applies = data.data;
    })

    $scope.SHOP_TYPE = SHOP_TYPE;

    $scope.accept = function (applyNumber) {
      ngDialog.openConfirm({
        template: "views/provider/customShop/modal/settlementTypeModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'SettlementTypeModalCtrl'
      }).then(function (value) {
        var queryParams = {};
        queryParams.id = applyNumber;
        queryParams.pricingPackageNumber = value.pricingPackageNumber[0];
        queryParams.settlementType = value.settlementType[0];
        queryParams.hasExpressProcess = value.hasExpressProcess[0];
        queryParams = JSON.parse(JSON.stringify(queryParams));
        console.log(queryParams);
        providerService.acceptApply(queryParams).then(function (data) {
          if(data && data.success == true) {
            providerService.newApplies().then(function (data) {
              $scope.applies = data.data;
            })
            providerService.newApplyCount().then(function (data) {
              $scope.newApplyCount = data.data.newApply;
            })
            toaster.pop('success', ' 建立业务合作成功！');
          }
        })
      }, function (value) {

      })

    }



  })

/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('CooperationApplicationDetailCtrl', function ($scope, ngDialog, $state, SHOP_TYPE, providerService, toaster) {
    if ($state.params.apply == undefined) {
      $state.go('provider.customShop.cooperationApplication', {}, {inherit: false});
    }

    $scope.SHOP_TYPE = SHOP_TYPE;
    $scope.apply = $state.params.apply.shop;
    $scope.applyNumber = $state.params.apply.number;


    $scope.refuse = function (applyNumber) {
      providerService.refuseApply(applyNumber).then(function (data) {
        if(data && data.success == true) {
          $state.go('provider.customShop.cooperationApplication', {}, {inherit: false})
        }
      })
    }

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
            toaster.pop('success', ' 建立业务合作成功！');
            $state.go('provider.customShop.cooperationApplication', {}, {inherit: false});
          }
        })
      }, function (value) {

      })

    }




  })

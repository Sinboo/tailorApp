/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('OrderDetailCtrl', function ($scope, dataSetterGetter, big, toaster, $stateParams, $state, commonService, tailoringTypes, SHOP_TYPE, providerService, Lightbox, ngDialog, ORDER_STATUS, CURRENCY, FABRIC_UNIT) {
    $scope.ORDER_STATUS = ORDER_STATUS;
    $scope.CURRENCY = CURRENCY;
    $scope.FABRIC_UNIT = FABRIC_UNIT;
    $scope.tailoringTypes = tailoringTypes;
    $scope.truncateDecimals = commonService.truncateDecimals;


    $scope.total = dataSetterGetter.get('orderNum');
    $scope.STATUS = dataSetterGetter.get('STATUS');
    if ($state.params.order == undefined) {
      $state.go('provider.orderManage.myOrderManage', {STATUS: 'PAYED'}, {inherit: false});
    }

    $scope.orders = $state.params.order.items;
    $scope.totalPrice = $state.params.order.totalPrice;
    $scope.totalPrice4CNY = $state.params.order.totalPrice4CNY;
    $scope.shopName = $state.params.order.shopName;

    $scope.orderInfo = $state.params.order.items[0].orderItem;
    $scope.remark = $state.params.order.remark;
    $scope.currency = $state.params.order.currency;
    $scope.exchangeRate = $state.params.order.exchangeRate;
    $scope.fabricFee = $state.params.order.fabricFee;
    $scope.expressFee = $state.params.order.expressFee;
    $scope.hasExFeeFlag = $state.params.order.expressFee !== 0;
    $scope.settlementType = $state.params.order.settlementType;
    $scope.hasExpressFeeProcess = $state.params.order.hasExpressFeeProcess;

    $scope.orderId = $state.params.order.number;

    $scope.setExpressFee = function (expressFee) {
      if (isNaN(expressFee) || expressFee == "") {layer.msg('请用数字填写运费', {shift: 6});}
      var expressFeeNum = isNaN(expressFee) || expressFee == "" ? 0 : Number(expressFee);
      $scope.expressFee = expressFeeNum;
      var totalPrice = [];
      totalPrice.push($scope.fabricFee);
      totalPrice.push(expressFeeNum);
      $scope.totalPrice = big.sum(totalPrice).toFixed(4);
      $scope.totalPrice4CNY = big.sum(totalPrice).times($scope.exchangeRate).toFixed(4);
    };


    $scope.images = [
      {
        'url': $state.params.order.voucherUrl,
        'thumbUrl': $state.params.order.voucherUrl
      }
    ];

    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };

    $scope.sendExpressFee = function () {
      if (isNaN($scope.expressFee) || $scope.expressFee == "") {layer.msg('请用数字填写运费', {shift: 6}); return false;}

      var params = {};
      params.NUMBER = $state.params.order.number;
      params.expressFee = $scope.expressFee;
      console.log(params)
      providerService.setExpressFee(params).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '运费设置成功!');
          $state.go('provider.orderManage.myOrderManage', {STATUS: 'PLACED'}, {inherit: false});
        }
      })
    }

    $scope.send = function () {
      ngDialog.openConfirm({
        template: 'views/provider/orderManage/modal/sendInfoModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'SendInfoModalCtrl'
      }).then(
        function(value) {
          var postData = {}
          postData.company = value.company;
          postData.number = value.number;
          postData.remark = value.remark == "" ? undefined : value.remark;
          var ID = $scope.orderId;
          postData = JSON.parse(JSON.stringify(postData));
          providerService.sendOrder(postData, ID).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '发货成功!');
              $state.go('provider.orderManage.myOrderManage', {STATUS: 'PAYED'}, {inherit: false});
            }
          })
        },
        function(value) {
          toaster.pop('warning', '请尽快发货!');
        }
      );
    }



  });

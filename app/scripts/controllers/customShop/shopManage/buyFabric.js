/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('BuyFabricCtrl', function ($rootScope, $scope, $state, $stateParams, ngDialog, toaster, customShopService, commonService, upyun, rfc4122, localStorageService, tailoringTypes, CURRENCY, FABRIC_UNIT, payment, SETTLEMENT_TYPE) {
    $scope.CURRENCY = CURRENCY;
    $scope.SETTLEMENT_TYPE = SETTLEMENT_TYPE;
    $scope.FABRIC_UNIT = FABRIC_UNIT;
    $scope.expressFeeStatus = $stateParams.expressFeeStatus;
    $scope.expressFee = $stateParams.expressFee;
    $scope.totalPrice4CNYState = $stateParams.totalPrice4CNY;
    $scope.totalPriceState = $stateParams.totalPrice;
    $scope.fabricFeeState = $stateParams.fabricFee;
    $scope.remarkState = $stateParams.remark;
    $scope.truncateDecimals = commonService.truncateDecimals;

    if($stateParams.remark) {
      $scope.remark = $stateParams.remark;
    }

    $scope.payment = payment.data;
    console.log($scope.payment);

    if ($state.params.orderList == undefined) {
      $state.go('tailor.shopManage.fabricManage', {clothingType: $stateParams.clothingType}, {inherit: false});
    }

    $scope.tailoringTypes = tailoringTypes;

    $scope.checked = true;
    $scope.selected = {};

    $scope.supplierName = $stateParams.supplierName;
    $scope.factoryName = $stateParams.factoryName;


    $scope.orderToBuy = $state.params.orderList;
    console.log($scope.orderToBuy)
    var orderItems = [];
    var totalPrice = 0;
    angular.forEach($scope.orderToBuy, function (item) {
      $scope.selected[item.number] = true;
      totalPrice = totalPrice + item.totalPrice;
      orderItems.push(item.number);
    });
    $scope.orderItems = orderItems;
    $scope.totalPrice = totalPrice;
    $scope.totalPrice4CNY = $scope.totalPrice * $scope.payment.exchangeRate;
    console.log($scope.orderToBuy);
    console.log($scope.totalPrice4CNY);
    console.log(($scope.totalPrice4CNY*100));


    customShopService.factoryPartners().then(function (data) {
      $scope.factoryPartners = data.data;
      $scope.factoryPartner = _.groupBy($scope.factoryPartners, 'number')[$stateParams.factoryNum][0];
      console.log($scope.factoryPartner)
    })

    //upload image
    $scope.chooseImage = function (event) {
      $scope.imgChoosed = true;
      if ($scope.uploadText === '上传完成') {
        $scope.uploadText = '重新上传'
      }
    }

    $scope.uploadText = '上传付款凭证图片';
    upyun.on('uploading', function(progress) {
      $scope.uploadText =
        progress === 100 ?
          '上传完成' :
        '上传进度: ' + progress + '%';
      $scope.$apply();
    });

    $scope.upload = function() {
      if(!$scope.imgChoosed) {layer.msg('请选择要上传的图片', {offset: 0, shift: 6}); return false;}
      var merchantNumber = localStorageService.cookie.get('user').merchantNumber;
      var supplierNumber = $stateParams.supplierNumber;
      var uuidString = rfc4122.v4();
      var last = '{.suffix}';
      var imgUrl = '/' + merchantNumber +'/'+ supplierNumber +'/'+ '{year}/{mon}' +'/'+ uuidString + last;
      upyun.set('save-key', imgUrl);
      upyun.upload('uploadForm', function(err, response, image){
        if (err) console.error(err);
        if (image.code === 200 && image.message === 'ok') {
          $scope.image = {};
          $scope.image.ready = true;
          $scope.image.url = image.absUrl;
          console.log($scope.image.url)
        }
        $scope.$apply();
      });
    }

    $scope.deleteImage = function () {
      $scope.image.url = "";
      $scope.image.ready = false;
      if ($scope.uploadText === '上传完成') {
        $scope.uploadText = '重新上传'
      }
    };


    $scope.selectAll = function (checked) {
      if (checked) {
        var totalPrice = 0;
        var orderItems = [];
        angular.forEach($scope.orderToBuy, function (item) {
          $scope.selected[item.number] = true;
          totalPrice = totalPrice + item.totalPrice;
          orderItems.push(item.number);
        })
        $scope.totalPrice = totalPrice;
        $scope.totalPrice4CNY = $scope.totalPrice * $scope.payment.exchangeRate;
        $scope.orderItems = orderItems;
      }
      else {
        angular.forEach($scope.orderToBuy, function (item) {
          $scope.selected[item.number] = false;
        })
        $scope.totalPrice = 0;
        $scope.orderItems = [];
      }
      console.log($scope.selected)
    };

    $scope.setNotAll = function () {
      $scope.checked = false;
      var selectTotalPrice = 0;
      var orderItems = [];
      $.each($scope.selected, function (key, value) {
        if (value) {
          angular.forEach($scope.orderToBuy, function (item) {
            if (item.number == key) {
              selectTotalPrice = selectTotalPrice + item.totalPrice;
              orderItems.push(item.number);
            }
          })
        }
      })
      $scope.totalPrice = selectTotalPrice;
      $scope.totalPrice4CNY = $scope.totalPrice * $scope.payment.exchangeRate;
      $scope.orderItems = orderItems;
    }

    $scope.submitOrder = function () {
      if ($scope.payment.hasSettleProcess == false) {
        ngDialog.openConfirm({
          template: 'views/provider/orderManage/modal/sendInfoModal.html',
          className: 'ngdialog-theme-default dialogcaseeditor',
          controller: 'SendInfoModalCtrl'
        }).then(
          function(value) {
            var postData = {};
            postData.express = {};
            postData.express.company = value.company;
            postData.express.number = value.number;
            postData.express.remark = value.remark == "" ? undefined : value.remark;
            postData.supplierName = $stateParams.supplierName;
            postData.supplierNumber = $stateParams.supplierNumber;
            postData.items = $scope.orderItems;
            postData.remark = $scope.remark;
            postData.factoryNumber = $scope.factoryPartner.number;
            postData.createTime = new Date().getTime();
            postData = JSON.parse(JSON.stringify(postData));
            customShopService.orderFabricPrivate(postData).then(function (data) {
              if (data && data.success == true) {
                toaster.pop('success', '下单成功!');
                $state.go('tailor.shopManage.fabricManage', {clothingType: $stateParams.clothingType}, {inherit: false, reload: true});
              }
            })
          },
          function(value) {
            toaster.pop('warning', '请尽快下单!');
          }
        );
      }
      else {
        if ($stateParams.expressFeeStatus !== 'true') {
          if($scope.orderItems.length == 0) {layer.tips('请勾选要支付的订单', '#check_all'); scrollTo('#check_all'); return false;}
          if(!$scope.factoryPartner) {layer.tips('请选择工厂', '#selectFactory'); scrollTo('#selectFactory'); return false;}

          var postData = {};
          postData.factoryNumber = $scope.factoryPartner.number;
          postData.remark = $scope.remark;
          postData.supplierName = $stateParams.supplierName;
          postData.supplierNumber = $stateParams.supplierNumber;
          //postData.totalPrice = Math.floor($scope.totalPrice *100)/100; // 保留2位小数
          postData.totalPrice = commonService.truncateDecimals($scope.totalPrice, 2); // 保留2位小数
          //postData.totalPrice4CNY = Math.floor($scope.totalPrice4CNY *100)/100; // 保留2位小数
          postData.totalPrice4CNY = commonService.truncateDecimals($scope.totalPrice4CNY, 2); // 保留2位小数
          //postData.fabricFee = Math.floor($scope.totalPrice *100)/100; // 保留2位小数
          postData.fabricFee = commonService.truncateDecimals($scope.totalPrice, 2); // 保留2位小数
          postData.hasExpressFeeProcess = $scope.payment.hasExpressFeeProcess;
          postData.voucherUrl = $scope.image == undefined ? undefined : $scope.image.url;
          if ($scope.payment && $scope.payment.settlementType) {
            postData.settlementType = $scope.payment.settlementType;
            postData.payment = $scope.payment.payment;
          }
          postData.items = $scope.orderItems;
          var postString = JSON.stringify(postData);
          customShopService.orderFabric(postString).then(function (data) {
            if (data && data.success == true) {
              $state.go('tailor.shopManage.fabricManage', {clothingType: $stateParams.clothingType}, {inherit: false, reload: true});
              toaster.pop('success', '下单成功!');
            }
            else {
              toaster.pop('error', data.error.message);
              $state.go('tailor.shopManage.fabricManage', {clothingType: $stateParams.clothingType}, {inherit: false, reload: true});
            }
          })
        }
        if ($stateParams.expressFeeStatus == 'true') {
          var queryParams = {};
          queryParams.NUMBER = $stateParams.orderNumber;
          queryParams.voucherUrl = $scope.image == undefined ? undefined : $scope.image.url;
          console.log(queryParams)
          customShopService.confirmExpressFee(queryParams).then(function (data) {
            if (data && data.success == true) {
              $state.go('tailor.shopManage.orderManage', {STATUS: 'EXPRESSFEE_CONFIRMED'}, {inherit: false, reload: true});
              toaster.pop('success', '确认运费成功!');
            }
            if (data && data.success == false) {
              toaster.pop('error', data.error.message);
            }

          })

        }
      }
    };

    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};

  })

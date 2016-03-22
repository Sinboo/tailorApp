/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddOrderRecordCtrl', function ($scope, ngDialog, $state, CLOTHING_TYPE, commonService, customShopService, providerService, toaster) {
    $scope.order = {};
    $scope.item = {};
    $scope.item.quantity = 1;
    $scope.item.purchaseOrder = {};
    $scope.item.produceOrder = {};

    var beginYear = 1940;
    $scope.ages = [];
    for (var i = 0; i < 76 + 1; i++) {
      $scope.ages.push(beginYear + i);
    }
    $scope.ages.push('无');
    $scope.order.birthday = '无';


    customShopService.fabricPartners().then(function (data) {
      $scope.fabrics = data.data;
    });
    customShopService.factoryPartners().then(function (data) {
      $scope.factories = data.data;
      console.log($scope.factories)
    });
    customShopService.privateFabrics().then(function (data) {
      $scope.privateFabrics = data.data;
    })


    $scope.data = [];


    $scope.deleteInputRow = function (index) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此条记录？'}
      }).then(
        function(value) {
          $scope.data.splice(index, 1);
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };
    $scope.editInputRow = function (d, index) {
      var editItem = {};
      angular.copy(d, editItem);
      //editItem.purchaseOrder.quantity = editItem.purchaseOrder.quantity / 100;
      ngDialog.openConfirm({
        template: 'views/customShop/shopManage/modal/addInputRowModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddSubOrderModalCtrl',
        data: {fabrics: $scope.fabrics, factories: $scope.factories, editItem: editItem }
      }).then(
        function(value) {
          //value.purchaseOrder.quantity = value.purchaseOrder.quantity * 100; // m to cm
          $scope.data[index] = value;
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };
    $scope.copyInputRow = function (d) {
      var editItem = {};
      angular.copy(d, editItem);
      $scope.data.push(editItem);
      console.log($scope.data)
    };


    $scope.addInputRow = function () {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/addOrderChooseModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor'
      }).then(function (value) {
        ngDialog.openConfirm({
          template: 'views/customShop/shopManage/modal/addInputRowModalNoPlatform.html',
          className: 'ngdialog-theme-default dialogcaseeditor',
          controller: 'AddSubOrderModalCtrlNoPlatform',
          data: {fabrics: $scope.privateFabrics, factories: $scope.factories }
        }).then(
          function(value) {
            $scope.data.push(value);
          },
          function(value) {
            //Cancel or do nothing
          }
        );
      }, function (value) {
        if (value == 'platform') {
          ngDialog.openConfirm({
            template: 'views/customShop/shopManage/modal/addInputRowModal.html',
            className: 'ngdialog-theme-default dialogcaseeditor',
            controller: 'AddSubOrderModalCtrl',
            data: {fabrics: $scope.fabrics, factories: $scope.factories }
          }).then(
            function(value) {
              $scope.data.push(value);
            },
            function(value) {
              //Cancel or do nothing
            }
          );
        }
      })

    };

    $scope.tailoringTypes = [
      '西服套装2ps(A+B)',
      '西服套装3ps(A+B+C)',
      '西服套装（A+2B）',
      '套装（A+C）',
      '套装（B+C）',
      '上衣A',
      '裤子B',
      '马甲C',
      '大衣E',
      '衬衫D',
      '礼服G',
      '夹克F'
    ];

    $scope.disable = false;

    $scope.submitOrder = function () {
      if(!valid()){
        return;
      }
      var items = $scope.data;
      console.log(items);
      angular.forEach(items, function (item) {
        if ($scope.tailoringTypes.indexOf(item.tailoringType) === -1) {
          item.clothingTypes = 'OTHER';
          item.otherClothes = item.tailoringType;
        }
        else {
          item.clothingTypes = CLOTHING_TYPE[item.tailoringType];
        }
        delete item.tailoringType;
      });
      var postData = angular.extend($scope.order, {items: items});
      postData.birthday = postData.birthday == '无' ? undefined : postData.birthday + '-01-01';
      var postString = JSON.stringify(postData);
      $scope.disable = true;
      customShopService.addOrder(postString).then(function (data) {
        console.log(data);
        if (data && data.success == true) {
          toaster.pop('success', '添加订单成功!');
          $state.go('tailor.shopManage.orderRecord', {STATUS: 'DOING'});
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message );
          $scope.disable = false;
        }
        else {
          toaster.pop('error', '添加订单失败!');
          $scope.disable = false;
        }
      })
    };

    var valid = function() {
      if (!$scope.order.customerName) {layer.tips('姓名不能为空', '#doc-ipt-31'); scrollTo('#doc-ipt-31'); return false;}
      if ($scope.data.length == 0) {layer.tips('子订单不能为空', '#addItem'); scrollTo('#daddItem'); return false;}
      return true;
    };
    var scrollTo = function (id) {
      $('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);
    };

    $(document).on("click", ".setOrderPurchaseDate", function() {
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.setOrderPurchaseDate');
          input.val(date);
          input.trigger('input');
        }
      });
    });

  })

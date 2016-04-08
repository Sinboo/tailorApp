/**
 * Created by wxb on 16/1/10.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddSubOrderModalCtrl', function ($scope, customShopService, providerService, BREADTH, YARN_COUNT, CRAFT, COMPOSITION, FABRIC_COLOR, FLOWER_PATTERN) {
    if ($scope.ngDialogData.editItem) {
      $scope.item = $scope.ngDialogData.editItem;
    }
    else {
      $scope.item = {};
      $scope.item.quantity = 1;
      $scope.item.purchaseOrder = {};
      $scope.item.produceOrder = {};
    }

    $scope.yarnCounts = YARN_COUNT;
    $scope.breadths = BREADTH;
    $scope.compositions = COMPOSITION;
    $scope.fabricColors = FABRIC_COLOR;
    $scope.figures = FLOWER_PATTERN;
    $scope.crafts = CRAFT;

    $scope.getTailoringTypes = function(search) {
      var newTailoringTypes = $scope.tailoringTypes.slice();
      if (search && newTailoringTypes.indexOf(search) === -1) {
        newTailoringTypes.unshift(search);
      }
      return newTailoringTypes;
    }

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

    if ($scope.ngDialogData.editItem) {
      $scope.fabric = _.findWhere($scope.ngDialogData.fabrics, {number: $scope.ngDialogData.editItem.purchaseOrder.supplierNumber});
      $scope.brand = _.findWhere($scope.fabric.brands, {number: $scope.ngDialogData.editItem.purchaseOrder.brand});
    }

    $scope.setFabric = function (fabric) {
      $scope.item.purchaseOrder.supplierName = fabric.shortName;
      $scope.item.purchaseOrder.supplierNumber = fabric.number;
      $scope.brands = fabric.brands;
    }

    $scope.setBrand = function (brand) {
      $scope.item.purchaseOrder.brand = brand.number;
    }

    $scope.setFactory = function (factory) {
      $scope.item.factoryNumber = factory.number;
    }

    $scope.keyPress = function (e) {
      if(e.keyCode == 13) {
        $scope.getFabricsByProductNumber($scope.item.purchaseOrder.productNumber);
      }
    };

    $scope.getFabricsByProductNumber = function(productNumber) {
      var queryParams = {};
      queryParams.productNumber = productNumber == "" ? undefined : productNumber;
      queryParams.id = $scope.item.purchaseOrder.supplierNumber == "" ? undefined : $scope.item.purchaseOrder.supplierNumber;
      queryParams = JSON.parse(JSON.stringify(queryParams));
      console.log(queryParams)
      customShopService.queryFabric(queryParams).then(function (data) {
        var productList = [];
        angular.forEach(data.data, function (item) {
          if (item.salesStatus == 'NORMAL') {
            productList.push(item);
          }
        });
        $scope.queriedProducts = productList;
      })
    };

    $scope.setQueriedProduct = function (product) {
      //if (product.color) {
      $scope.item.purchaseOrder.color = product.color;
      $scope.item.purchaseOrder.breadth = product.breadth;
      $scope.item.purchaseOrder.composition = product.composition;
      $scope.item.purchaseOrder.yarnCount = product.yarnCount;
      $scope.item.purchaseOrder.colorDesc = product.colorDesc;
      $scope.item.purchaseOrder.figure = product.figure;

      $scope.disable_breadth = product.breadth !== null;
      $scope.disable_composition = product.composition !== null;
      $scope.disable_yarnCount = product.yarnCount !== null;
      $scope.disable_colorDesc = product.colorDesc !== null;
      $scope.disable_figure = product.figure !== null;

      $scope.stock = product.stock;
      $scope.salesStatus = product.salesStatus;
      //}
    }

    $scope.checkOutOfStock = function (value) {
      $scope.outOfStock = value > $scope.stock;
    };

    $scope.validate = function () {
      if($scope.outOfStock) {layer.msg('数量超库存了!', {offset: 0, shift: 6}); return false;}
      if($scope.salesStatus == 'OOS') {layer.msg('所选产品缺货!', {offset: 0, shift: 6}); return false;}
      if(!$scope.item.purchaseOrder.supplierNumber) {layer.msg('请设置面料供应商!', {offset: 0, shift: 6}); return false;}
      if(!$scope.item.factoryNumber) {layer.msg('请设置工厂!', {offset: 0, shift: 6}); return false;}
      return true;
    };

    $(document).on("click", ".setItemComingDate", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.setItemComingDate');
          input.val(date);
          input.trigger('input');
        }
      });
    })


  })

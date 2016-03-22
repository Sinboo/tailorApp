/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('QuickQueryCtrl', function ($scope, $stateParams, customShopService) {
    $scope.shortName = $stateParams.shortName;
    $scope.$emit('to-nav', {shortName: $stateParams.shortName, fabricId: $stateParams.fabricId});

    $scope.queryFabric = function (productNumber, color) {
      $scope.quickQueryShow = true;
      $scope.stockSatuation = false;
      var param = {};
      param.id = $stateParams.fabricId == "" ? undefined : $stateParams.fabricId;
      param.color = color == "" ? undefined : color;
      param.productNumber = productNumber == "" ? undefined : productNumber;
      param = JSON.parse(JSON.stringify(param));
      customShopService.queryFabric(param).then(function(data){
        $scope.queriedProducts = data.data;
      });
    };

    $scope.setProductStatus = function (product) {
      $scope.selectFabric = product;
      $scope.stockSatuation = true;
    }

  });

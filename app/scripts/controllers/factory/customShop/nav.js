/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FactoryCustomShopNavCtrl', function ($scope, $state, $location, SHOP_TYPE) {
    $scope.$on('to-customShop-nav', function (e, d) {
      angular.forEach($scope.businesses, function (item) {
        item.active = d;
      })
    });

    $scope.businesses = [];
    $.each(SHOP_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.value = key;
      typeItem.name = value;
      $scope.businesses.push(typeItem);
    });

    $scope.choose = function (business, $index) {
      angular.forEach($scope.businesses, function (item) {
        item.active = $scope.businesses[$index] == item;
      });

      $state.go('provider.customShop.myCustomShops', {business: business.value});

    };



    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  });

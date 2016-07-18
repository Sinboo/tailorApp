/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProvidersNavCtrl', function ($scope, $location, $state, FABRIC_TYPE, FACTORY_TYPE, ACCESSORY_TYPE ) {

    $scope.$on('to-providers-nav', function (e, d) {
      angular.forEach($scope.fabricBusiness, function (item) {
        item.active = d;
      })
    })

    $scope.fabricBusiness = [];
    $.each(FABRIC_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.value = key;
      typeItem.name = value;
      $scope.fabricBusiness.push(typeItem);
    });

    $scope.fabricChoose = function (business, $index) {
      angular.forEach($scope.fabricBusiness, function (item) {
        item.active = $scope.fabricBusiness[$index] == item;
      });
      $state.go('tailor.providers.fabrics', {business: business.value})
    };

    $scope.factoryBusiness = [];
    $.each(FACTORY_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.value = key;
      typeItem.name = value;
      $scope.factoryBusiness.push(typeItem);
    });

    $scope.factoryChoose = function (business, $index) {
      angular.forEach($scope.factoryBusiness, function (item) {
        item.active = $scope.factoryBusiness[$index] == item;
      });
      $state.go('tailor.providers.factories', {business: business.value})
    };

    $scope.accessoryBusiness = [];
    $.each(ACCESSORY_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.value = key;
      typeItem.name = value;
      $scope.accessoryBusiness.push(typeItem);
    });

    $scope.accessoryChoose = function (business, $index) {
      angular.forEach($scope.accessoryBusiness, function (item) {
        item.active = $scope.accessoryBusiness[$index] == item;
      });
      $state.go('tailor.providers.accessories', {business: business.value})
    };
    
    


    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  })

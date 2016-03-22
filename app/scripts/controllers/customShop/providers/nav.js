/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProvidersNavCtrl', function ($scope, $location, $state, FABRIC_TYPE ) {

    $scope.$on('to-providers-nav', function (e, d) {
      angular.forEach($scope.businesses, function (item) {
        item.active = d;
      })
    })

    //$scope.businesses = [{value:'GYJ', name: '国产精纺羊毛'}, {value: 'JYJ', name: '进口精纺羊毛'}, {value: 'GYD', name: '国产羊毛大衣'}];
    $scope.businesses = [];
    $.each(FABRIC_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.value = key;
      typeItem.name = value;
      $scope.businesses.push(typeItem);
    });

    $scope.choose = function (business, $index) {
      angular.forEach($scope.businesses, function (item) {
        if ($scope.businesses[$index] == item) {
          item.active = true;
        }
        else {
          item.active = false;
        }
      })

      $state.go('tailor.providers.fabrics', {business: business.value})

    };


    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  })

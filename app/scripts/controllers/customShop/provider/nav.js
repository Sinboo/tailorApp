/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProviderNavCtrl', function ($scope, $location, customShopService) {
    customShopService.fabricPartners().then(function (data) {
      $scope.fabrics = data.data;
    })

    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  })

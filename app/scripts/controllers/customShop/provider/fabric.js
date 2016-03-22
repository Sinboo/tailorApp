/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FabricCtrl', function ($scope, customShopService) {
    customShopService.fabricPartners().then(function (data) {
      $scope.fabrics = data.data;
    })


  })

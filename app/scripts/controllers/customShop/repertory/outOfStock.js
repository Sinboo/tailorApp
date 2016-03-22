/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('OutOfStockCtrl', function ($scope, customShopService, $stateParams) {
    customShopService.getPartenFabricOos($stateParams.fabricId).then(function (data) {
      $scope.items = data.data;
    })

  })

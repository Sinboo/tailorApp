/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('CanceledCtrl', function ($scope, customShopService, $stateParams) {
    customShopService.getPartenFabricHalt($stateParams.fabricId).then(function (data) {
      $scope.items = data.data;
    })
  })

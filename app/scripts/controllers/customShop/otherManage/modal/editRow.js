/**
 * Created by wxb on 16/1/8.
 */
'use strict';

angular.module('tailorApp')
  .controller('CustomerEditRowModalCtrl', function ($scope, factoryService, localStorageService, PRIVILEGE_CUSTOMER, PRIVILEGE_FABRIC) {
    var merchantType = localStorageService.cookie.get('user').merchantType;
    var PRIVILEGE = {};
    if (merchantType == 'SHOP') {
      PRIVILEGE = PRIVILEGE_CUSTOMER;
    }
    else if (merchantType == 'FABRIC') {
      PRIVILEGE = PRIVILEGE_FABRIC;
    }

    if ($scope.ngDialogData) {
      $scope.account = $scope.ngDialogData;
      $scope.account.permission = [];
      $scope.account.orderAssignment = [];
      $.each($scope.ngDialogData.privilege, function (key, value) {
        $scope.account.permission.push(key);
      });
    }
    else {
      $scope.account = {};
    }

    $scope.permissions = [];
    $.each(PRIVILEGE, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.permissions.push(typeItem);
    });


    $scope.validate = function () {
      if(!$scope.account.accountName) {layer.msg('请选择订单运费', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

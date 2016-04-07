/**
 * Created by wxb on 16/1/8.
 */
'use strict';

angular.module('tailorApp')
  .controller('EditRowModalCtrl', function ($scope, factoryService, PRIVILEGE) {
    if ($scope.ngDialogData) {
      $scope.account = $scope.ngDialogData;
      $scope.account.permission = [];
      $scope.account.orderAssignment = [];
      $.each($scope.ngDialogData.privilege, function (key, value) {
        $scope.account.permission.push(key);
        if (key == 'PRODUCE') {
          $scope.flag = true;
          $scope.account.orderAssignment = $scope.ngDialogData.privilege['PRODUCE'];
        }
      });

      factoryService.unassignedPartners().then(function (data) {
        $scope.orderAssignments = [];
        $.each(data.data, function (key, value) {
          var typeItem = {};
          typeItem.shortName = key;
          typeItem.fullName = value;
          $scope.orderAssignments.push(typeItem);
        });

        if($scope.ngDialogData.privilege && $scope.ngDialogData.privilege['PRODUCE'] && $scope.ngDialogData.privilege['PRODUCE'].length > 0) {
          $.each($scope.ngDialogData.privilege['PRODUCE'], function (key, value) {
            var typeItem = {};
            typeItem.shortName = value;
            typeItem.fullName = $scope.ngDialogData.partners[value];
            $scope.orderAssignments.push(typeItem);
          });
        }
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


    $scope.choose = function () {
      $scope.flag = $scope.account.permission.indexOf('PRODUCE') !== -1;
    };


    $scope.validate = function () {
      if(!$scope.account.accountName) {layer.msg('请选择订单运费', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

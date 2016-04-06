/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ModifySubAccountCtrl', function ($scope, factoryService, PRIVILEGE, ngDialog, toaster) {
    $scope.account = {};

    factoryService.subAccounts().then(function (data) {
      $scope.subAccounts = data.data;
      angular.forEach($scope.subAccounts, function (item) {
        item.privilegeString = [];
        $.each(item.privilege, function (key, value) {
          item.privilegeString.push(PRIVILEGE[key])
        })
      })
    });
    
    $scope.editRow = function (subAccount) {
      ngDialog.openConfirm({
        template: 'views/factory/otherManage/modal/editRow.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'EditRowModalCtrl',
        data: subAccount
      }).then(
        function (value) {
          
        },
        function (value) {
          
        }
      )
    };
    
    $scope.deleteRow = function (ID) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此子账户？'}
      }).then(
        function(value) {
          factoryService.deleteSubAccount(ID).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '删除子账户成功！');
              factoryService.subAccounts().then(function (data) {
                $scope.subAccounts = data.data;
                angular.forEach($scope.subAccounts, function (item) {
                  item.privilegeString = [];
                  $.each(item.privilege, function (key, value) {
                    item.privilegeString.push(PRIVILEGE[key])
                  })
                })
              });
            }
          })
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    }

    


  })

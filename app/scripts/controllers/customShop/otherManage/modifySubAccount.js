/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('CustomerModifySubAccountCtrl', function ($scope, factoryService, localStorageService, PRIVILEGE_CUSTOMER, PRIVILEGE_FABRIC, ngDialog, toaster) {
    $scope.account = {};
    var merchantType = localStorageService.cookie.get('user').merchantType;

    factoryService.subAccounts().then(function (data) {
      $scope.subAccounts = data.data.accounts;
      angular.forEach($scope.subAccounts, function (item) {
        item.privilegeString = [];
        item.partners = data.data.opPartners;
        $.each(item.privilege, function (key, value) {
          if (merchantType == 'SHOP') {
            item.privilegeString.push(PRIVILEGE_CUSTOMER[key])
          }
          else if (merchantType == 'FABRIC') {
            item.privilegeString.push(PRIVILEGE_FABRIC[key])
          }
        })
      })
    });
    
    $scope.editRow = function (subAccount) {
      ngDialog.openConfirm({
        template: 'views/customShop/otherManage/modal/editRow.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'CustomerEditRowModalCtrl',
        data: subAccount
      }).then(
        function (value) {
          console.log(value)
          var params = {};
          params.privilege = {};
          params.accountName =  value.accountName;
          angular.forEach(value.permission, function (item) {
            params.privilege[item] = new Array("ALL");
          });
          console.log(params);
          factoryService.modifySubAccount(params, value.accountNumber).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '修改子账户成功！');
              factoryService.subAccounts().then(function (data) {
                $scope.subAccounts = data.data.accounts;
                angular.forEach($scope.subAccounts, function (item) {
                  item.privilegeString = [];
                  item.partners = data.data.opPartners;
                  $.each(item.privilege, function (key, value) {
                    if (merchantType == 'SHOP') {
                      item.privilegeString.push(PRIVILEGE_CUSTOMER[key])
                    }
                    else if (merchantType == 'FABRIC') {
                      item.privilegeString.push(PRIVILEGE_FABRIC[key])
                    }
                  })
                })
              });
            }
            else if (data && data.success == false) {
              toaster.pop('error', data.error.message);
            }
          })
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
                $scope.subAccounts = data.data.accounts;
                angular.forEach($scope.subAccounts, function (item) {
                  item.privilegeString = [];
                  item.partners = data.data.opPartners;
                  $.each(item.privilege, function (key, value) {
                    if (merchantType == 'SHOP') {
                      item.privilegeString.push(PRIVILEGE_CUSTOMER[key])
                    }
                    else if (merchantType == 'FABRIC') {
                      item.privilegeString.push(PRIVILEGE_FABRIC[key])
                    }
                  })
                })
              });
            }
            else if (data && data.success == false) {
              toaster.pop('error', data.error.message);
            }
          })
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    }

  });

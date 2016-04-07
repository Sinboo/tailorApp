/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ModifySubAccountCtrl', function ($scope, factoryService, PRIVILEGE, ngDialog, toaster) {
    $scope.account = {};

    factoryService.subAccounts().then(function (data) {
      $scope.subAccounts = data.data.accounts;
      angular.forEach($scope.subAccounts, function (item) {
        item.privilegeString = [];
        item.partners = data.data.opPartners;
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
          console.log(value)
          var params = {};
          params.privilege = {};
          params.accountName =  value.accountName;
          angular.forEach(value.permission, function (item) {
            if (item !== 'PRODUCE' && item) {
              params.privilege[item] = new Array("ALL");
            }
            else if (item && item == 'PRODUCE') {
              var orderAssignments = [];
              angular.forEach(value.orderAssignment, function (item) {
                orderAssignments.push(item);
              });
              params.privilege[item] = orderAssignments;
            }
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
                    item.privilegeString.push(PRIVILEGE[key])
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
                    item.privilegeString.push(PRIVILEGE[key])
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

    


  })

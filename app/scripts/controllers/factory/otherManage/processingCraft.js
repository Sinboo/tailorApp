/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProcessingCraftCtrl', function ($scope, $stateParams, factoryService, PRIVILEGE, ngDialog, toaster) {
    $scope.STATUS = $stateParams.STATUS;

    function initData() {
      factoryService.getCrafts().then(function (data) {
        if (data && data.success == true) {
          if ($scope.STATUS == 'standard') {
            $scope.processingCrafts = data.data.normalCrafts;
          }
          else if ($scope.STATUS == 'special') {
            $scope.processingCrafts = data.data.specCrafts;
          }
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      });
    }
    initData();

    $scope.addCraft = function (name) {
      if (name == undefined || name == "") {
        layer.alert('请输入工艺名称!')
        return;
      }
      var postData = {};
      postData.isSpec = $scope.STATUS == 'special';
      postData.name = name;
      factoryService.addCraft(postData).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '增加工艺成功！');
          $scope.craftName = "";
          initData();
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      })
    };
    
    $scope.deleteRow = function (name) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此工艺？'}
      }).then(
        function(value) {
          var queryParams = {};
          queryParams.name = name;
          queryParams.isSpec = $scope.STATUS == 'special';
          factoryService.deleteCraft(queryParams).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '删除工艺成功！');
              initData();
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

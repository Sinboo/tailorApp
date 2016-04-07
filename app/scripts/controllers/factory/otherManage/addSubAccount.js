/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddSubAccountCtrl', function ($scope, factoryService, PRIVILEGE, $http, $state, toaster) {
    $scope.account = {};

    $scope.permissions = [];
    $.each(PRIVILEGE, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.permissions.push(typeItem);
    });

    $scope.choose = function () {
      console.log($scope.account.permission);
      $scope.flag = $scope.account.permission.indexOf('PRODUCE') !== -1;
    };

    factoryService.unassignedPartners().then(function (data) {
      $scope.orderAssignments = [];
      $.each(data.data, function (key, value) {
        var typeItem = {};
        typeItem.shortName = key;
        typeItem.fullName = value;
        $scope.orderAssignments.push(typeItem);
      });
    });

    $scope.chooseOrder = function () {
      console.log($scope.account.orderAssignment);
    };

    $scope.confirm = function () {
      var params = {};
      params.privilege = {};
      params.accountName =  $scope.account.accountName;
      params.passwd = $scope.account.passwd;
      angular.forEach($scope.account.permission, function (item) {
        if (item !== 'PRODUCE' && item) {
          params.privilege[item] = new Array("ALL");
        }
        else if (item && item == 'PRODUCE') {
          var orderAssignments = [];
          angular.forEach($scope.account.orderAssignment, function (item) {
            orderAssignments.push(item);
          });
          params.privilege[item] = orderAssignments;
        }
      });
      var postData = JSON.stringify(params)
      console.log(postData);
      factoryService.addSubAccount(postData).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '添加子账户成功！');
          $state.go('factory.otherManage.modifySubAccount');
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      })
    };




    $scope.validate = function () {
      if(!$scope.account.accountName) {layer.tips('请输入子账号名称', '#doc-ipt-pwd-4'); scrollTo('#doc-ipt-pwd-4'); return false;}
      if(!$scope.account.passwd) {layer.tips('请输入密码', '#doc-ipt-pwd-2'); scrollTo('#doc-ipt-pwd-2'); return false;}
      if($scope.account.passwd !== $scope.account.confirmPasswd) {layer.tips('两次输入的新密码不同!', '#doc-ipt-pwd-3'); scrollTo('#doc-ipt-pwd-3'); return false;}
      return true;
    };

    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

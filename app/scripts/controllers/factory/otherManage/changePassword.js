/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FactoryFixPWDCtrl', function ($scope, loginService, $http, $state, toaster) {
    $scope.account = {};

    //$scope.confirm = function () {
    //  var param = {};
    //  param.oldPasswd = $scope.account.oldPasswd;
    //  param.newPasswd = $scope.account.newPasswd;
    //  var putParam = $.param(param);
    //  console.log(putParam);
    //  var url = '/api/v1/account/{ID}/passwd'.format({ID: $scope.account.ID});
    //  $http.put(url, param, {
    //    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    //    transformRequest: function(data){return $.param(data);}
    //  }).success(function(data) {
    //    if (data.success == true) {
    //      toaster.pop('success', '密码修改成功!');
    //      $state.go('provider.moreManage.changePassword');
    //    }
    //  })
    //};

    $scope.confirm = function () {
      var param = {};
      param.oldPasswd = $scope.account.oldPasswd;
      param.newPasswd = $scope.account.newPasswd;
      param.ID = $scope.account.ID;
      loginService.changePassword(param).then(function (data) {
        if (data.success == true) {
          toaster.pop('success', '密码修改成功!');
          $state.go('provider.businessManage.addProduct');
        }
        else {
          toaster.pop('error', data.error.message);
        }
      })
    };


    $scope.validate = function () {
      if(!$scope.account.ID) {layer.tips('请输入账号ID', '#doc-ipt-3'); scrollTo('#doc-ipt-3'); return false;}
      if(!$scope.account.oldPasswd) {layer.tips('请输入旧密码', '#doc-ipt-pwd-2'); scrollTo('#doc-ipt-pwd-2'); return false;}
      if(!$scope.account.newPasswd) {layer.tips('请输入新密码', '#doc-ipt-pwd-3'); scrollTo('#doc-ipt-pwd-3'); return false;}
      if(!$scope.account.reNewPasswd) {layer.tips('请再次输入新密码', '#doc-ipt-pwd-4'); scrollTo('#doc-ipt-pwd-4'); return false;}
      if($scope.account.reNewPasswd !== $scope.account.newPasswd) {layer.tips('两次输入的新密码不同!', '#doc-ipt-pwd-4'); scrollTo('#doc-ipt-pwd-4'); return false;}
      return true;
    }

    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

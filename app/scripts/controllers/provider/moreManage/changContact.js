/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ChangeContactCtrl', function ($scope, providerService, commonService, $http, $state, toaster) {
    $scope.modalData = {};

    providerService.nowContact().then(function (data) {
      $scope.modalData.nowPerson = data.data.person;
      $scope.modalData.nowPhone = data.data.phone;
    });

    $scope.confirm = function () {
      var queryParams = {};
      queryParams.person = $scope.modalData.newPerson;
      queryParams.phone = $scope.modalData.newPhone;
      providerService.newContact(queryParams).then(function (data) {
        if (data.success == true) {
          toaster.pop('success', '联系人修改成功!');
          window.location.reload();
        }
        else {
          toaster.pop('error', data.error.message);
        }
      })
    };


    $scope.validate = function () {
      if(!$scope.modalData.newPerson) {layer.tips('请输入新联系人', '#doc-ipt-2'); scrollTo('#doc-ipt-2'); return false;}
      if(!$scope.modalData.newPhone) {layer.tips('请输入新的手机号', '#doc-ipt-4'); scrollTo('#doc-ipt-4'); return false;}
      if(!commonService.regMobile($scope.modalData.newPhone)) {layer.tips('请输入正确的手机号', '#doc-ipt-4'); scrollTo('#doc-ipt-4'); return false;}

      return true;
    }

    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

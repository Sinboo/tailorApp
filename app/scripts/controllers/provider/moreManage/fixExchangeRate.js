/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FixExchangeRateCtrl', function ($scope, providerService, $http, $state, toaster) {
    $scope.modalData = {};

    providerService.nowExchangeRate().then(function (data) {
      $scope.modalData.nowExchangeRate = data.data;
    });

    $scope.confirm = function () {
      var queryParams = {};
      queryParams.rate = $scope.modalData.newExchangeRate;
      providerService.newExchangeRate(queryParams).then(function (data) {
        if (data.success == true) {
          toaster.pop('success', '汇率修改成功!');
          window.location.reload();
        }
        else {
          toaster.pop('error', data.error.message);
        }
      })
    };


    $scope.validate = function () {
      if(!$scope.modalData.newExchangeRate) {layer.tips('请输入新汇率', '#doc-ipt-2'); scrollTo('#doc-ipt-2'); return false;}
      return true;
    }

    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

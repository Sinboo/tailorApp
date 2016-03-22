/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FabricDetailCtrl', function ($scope, $stateParams, $timeout, providerService, $http, ngDialog, toaster) {
    providerService.getFabricDetailById($stateParams.id).then(function (data) {
      $scope.fabric = data.data;
    })

    $scope.setPartner = function (fabricNumber) {
      var postData = {};
      postData.supplierNumber = fabricNumber;
      $http.post("/api/v1/apply/partner", postData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest: function (data) {return $.param(data);}
      }).then(function (data) {
        console.log(data);
        var dialog = ngDialog.open({template: '<div class="ngdialog-message"> \
                <span class="am-text-success">已通知对方，对方会主动与你联系，请等待。</span></div>\
                <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />',
          plain: 'true'
        });
        var timer = $timeout(function() {
          dialog.close();
        }, 2000);
      })


    }




  })

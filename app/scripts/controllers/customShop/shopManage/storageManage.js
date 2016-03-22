/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('StorageManageCtrl', function ($scope, $stateParams, toaster, $state, customShopService, PAGE_SIZE, commonService, STORAGE_STATUS, ngDialog, tailoringTypes) {
    $scope.tailoringTypes = tailoringTypes;
    $scope.covertDate = commonService.convertDate;
    $scope.STORAGE_STATUS = STORAGE_STATUS;
    $scope.STATUS = $stateParams.STATUS;
    if ($stateParams.STATUS == 'IN') {
      $scope.STATUS = $stateParams.notified == 'false' ? 'IN' : 'INNOTI';
    }

    $scope.$emit('to-shopManageNav', $stateParams.notified);

    customShopService.factoryPartners().then(function (data) {
      $scope.factories = data.data;
    });

    var param = {};
    param.page = 0;
    param.pageSize = PAGE_SIZE;
    param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
    param.notified = $stateParams.notified;
    if (param.STATUS == 'INIT' || param.STATUS == 'OUT') {
      param.notified = undefined;
    }
    var queryParams = JSON.parse(JSON.stringify(param));

    customShopService.getStorage(queryParams).then(function (data) {
      initData(queryParams, data.data)
    })

    var initData = function (param, data) {
      $scope.orders = data.content;
      $scope.total = data.totalElements;
      console.log($scope.orders);

      $scope.bigTotalItems = data.totalElements;
      $scope.maxSize = 10;
      $scope.perPages = 20;
      $scope.bigCurrentPage = param.page + 1 || 1;
    };

    $scope.changeFn = function (key, value) {
      if (key === 'page') {
        param[key] = $scope.bigCurrentPage - 1;
      } else {
        param[key] = value == "" ? undefined : value;
      }
      var queryParams = JSON.parse(JSON.stringify(param));
      customShopService.getStorage(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };

    $scope.receiveCloth = function (NUBMBER) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/receiveClothModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'ReceiveClothModalCtrl'
      }).then(function (value) {
        var queryParam = {};
        queryParam.NUMBER = NUBMBER;
        queryParam.receiveDate = value.receiveDate;
        customShopService.receiveCloth(queryParam).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '入库成功!');
            param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
            param.notified = $stateParams.notified;
            if (param.STATUS == 'INIT' || param.STATUS == 'OUT') {
              param.notified = undefined;
            }
            param = JSON.parse(JSON.stringify(param));

            customShopService.getStorage(param).then(function (data) {
              initData(param, data.data)
            })
          }
          else if (data && data.success == false) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function (value) {

      })
    }

    $scope.informClient = function (NUBMBER) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/informClientModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'InformClientModalCtrl'
      }).then(function (value) {
        var queryParam = {};
        queryParam.NUMBER = NUBMBER;
        queryParam.notifyDate = value.receiveDate;
        customShopService.informClient(queryParam).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '通知成功!');
            param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
            param.notified = $stateParams.notified;
            if (param.STATUS == 'INIT' || param.STATUS == 'OUT') {
              param.notified = undefined;
            }
            param = JSON.parse(JSON.stringify(param));

            customShopService.getStorage(param).then(function (data) {
              initData(param, data.data)
            })
          }
          else if (data && data.success == false) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function (value) {

      })
    }

    $scope.takeProduct = function (NUBMBER) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/takeProductModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'TakeProductModalCtrl'
      }).then(function (value) {
        var queryParam = {};
        queryParam.NUMBER = NUBMBER;
        queryParam.feedback = value.feedback;
        queryParam.remark = value.remark;
        queryParam.takeAwayDate = value.takeAwayDate;
        customShopService.takeProduct(queryParam).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '取衣成功!');
            param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
            param.notified = $stateParams.notified;
            if (param.STATUS == 'INIT' || param.STATUS == 'OUT') {
              param.notified = undefined;
            }
            param = JSON.parse(JSON.stringify(param));

            customShopService.getStorage(param).then(function (data) {
              initData(param, data.data)
            })
          }
          else if (data && data.success == false) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function (value) {

      })
    }

    $scope.returnFactory = function (NUBMBER) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/returnFactoryModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'ReturnFactoryModalCtrl',
        data: {factories: $scope.factories}
      }).then(function (value) {
        var postData = {};
        angular.copy(value, postData);
        postData.detailPicUrl = postData.image.url;
        delete postData.image;
        customShopService.returnFactory(postData, NUBMBER).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '返厂成功!');
            param.STATUS = $stateParams.STATUS == "" ? undefined : $stateParams.STATUS;
            param.notified = $stateParams.notified;
            if (param.STATUS == 'INIT' || param.STATUS == 'OUT') {
              param.notified = undefined;
            }
            param = JSON.parse(JSON.stringify(param));

            customShopService.getStorage(param).then(function (data) {
              initData(param, data.data)
            })
          }
          else if (data && data.success == false) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function (value) {

      })
    }

  })

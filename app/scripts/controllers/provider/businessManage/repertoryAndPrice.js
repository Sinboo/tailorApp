/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('RepertoryAndPriceCtrl', function ($scope, providerService, localStorageService, toaster, ngDialog, FABRIC_UNIT, CURRENCY, SALES_STATUS, PAGE_SIZE, $timeout) {
    $scope.SALES_STATUS = SALES_STATUS;

    var param = {};
    param.page = 0;
    param.pageSize = PAGE_SIZE;
    var queryParams = JSON.parse(JSON.stringify(param));
    providerService.getProducts(queryParams).then(function(data){
      initData(queryParams, data.data)
    });

    $scope.FABRIC_UNIT = FABRIC_UNIT;
    $scope.CURRENCY = CURRENCY;
    $scope.currency = localStorageService.cookie.get('user').currency;
    $scope.fabricUnit = localStorageService.cookie.get('user').fabricUnit;


    var initData = function (param, data) {
      providerService.getPriceSystems().then(function (priceSystems) {
        $scope.priceSystems = priceSystems.data;
        $scope.stocks = data.content;
        $scope.total = data.totalElements;

        $scope.bigTotalItems = data.totalElements;
        $scope.maxSize = 10;
        $scope.perPages = PAGE_SIZE;
        $scope.bigCurrentPage = param.page + 1 || 1;
      })
    };

    $scope.changeFn = function (key, value) {
      if (key === 'page') {
        param[key] = $scope.bigCurrentPage - 1;
      } else {
        param[key] = value == "" ? undefined : value;
      }
      var queryParams = JSON.parse(JSON.stringify(param));
      providerService.getProducts(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };

    $scope.addPriceSystem = function () {
      ngDialog.openConfirm({
        template: 'views/provider/businessManage/modal/addPriceSystemModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddPriceSystemModalCtrl'
      }).then(
        function(value) {
          if (_.findWhere($scope.priceSystems, {name: value.name})) {
            var dialog = ngDialog.open({template: '<div class="ngdialog-message"> \
                <span class="am-text-primary">新增价格体系的<span class="am-text-warning">名字已经曾在</span>,请更换。</span></div>\
                <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />',
              plain: 'true'
            });
            $timeout(function() {
              dialog.close();
            }, 1200);
          }
          else {
            $scope.priceSystemName = value.name;
            $scope.priceSystemInputFlag = true;
          }
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };

    $scope.confirmPriceSystem = function () {
      $scope.priceSystemInputFlag = false;
      $scope.psEditIndex = null;
      var postData = {};
      if ($scope.priceSystemEditFlag) {
        angular.forEach($scope.stocks, function (item) {
          postData[item.number] = item.psPrice;
        });
        providerService.updatePriceSystem(postData, $scope.editPsNumber).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '价格体系修改成功！');
            providerService.getProducts(param).then(function(data){
              initData(param, data.data)
            });
          }
        });
        $scope.priceSystemEditFlag = false;
      }
      else {
        postData.name = $scope.priceSystemName;
        postData.priceSetup = {};
        angular.forEach($scope.stocks, function (item) {
          postData.priceSetup[item.number] = item.psPrice;
        })
        providerService.createPriceSystem(postData).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '价格体系添加成功！');
            providerService.getProducts(param).then(function(data){
              initData(param, data.data)
            });
          }
        })
      }
    };

    $scope.editPriceSystem = function (index, NUMBER) {
      if($scope.priceSystemEditFlag && $scope.psEditIndex !== index) {
        var dialog = ngDialog.open({template: '<div class="ngdialog-message"> \
                <span class="am-text-secondary">请先完成当前价格体系的修改后, <br/>点击页面右下方的<span class="am-text-warning">"确定价格体系"</span>按钮。</span></div>\
                <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />',
          plain: 'true'
        });
        $timeout(function() {
          dialog.close();
        }, 1600);
        return;
      }
      $scope.priceSystemEditFlag = true;
      $scope.psEditIndex = index;
      $scope.editPsNumber = NUMBER;
    }

    $scope.deleteInputRow = function (number) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此条记录？'}
      }).then(
        function(value) {
          providerService.deleteProduct(number).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '删除产品成功！');
              providerService.getProducts(param).then(function(data){
                initData(param, data.data)
              });
            }
          })
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };

    $scope.editInputRow = function (d) {
      var editItem = {};
      angular.copy(d, editItem);
      ngDialog.openConfirm({
        template: 'views/provider/businessManage/modal/addInputRowModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddInputRowModalCtrl',
        data: {editItem: editItem}
      }).then(
        function(value) {
          console.log(value)
          if (value.color) {
            if (_.where($scope.stocks, {productNumber: value.productNumber, color: value.color}).length > 1) {
              toaster.pop('error', '面料货号和色号不能同时重复！');
              return;
            }
          }
          else {
            if (_.where($scope.stocks, {productNumber: value.productNumber}).length > 1) {
              toaster.pop('error', '面料货号和色号不能同时重复！');
              return;
            }
          }

          $.each(d, function (K, V) {
            if (!_.has(value, K)) {
              value.K = V;
            }
          });

          console.log(value)

          providerService.editProduct(value).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '更新产品成功！');
              providerService.getProducts(param).then(function(data){
                initData(param, data.data)
              });
            }
          })
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };



  })

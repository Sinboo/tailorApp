/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddProductCtrl', function ($scope, $state, ngDialog, providerService, toaster, FABRIC_TYPE) {
    $scope.fabricTypeList = [];
    $.each(FABRIC_TYPE, function (key, value) {
      var typeItem = {};
      typeItem.shortName = key;
      typeItem.fullName = value;
      $scope.fabricTypeList.push(typeItem);
    });

    $scope.product = {};

    $scope.setFabricTypeShortName = function (shortName) {
      $scope.product.fabricType = shortName;
    };

    providerService.getBrandList().then(function (data) {
      $scope.brands = data.data;
    });
    $scope.setBrand = function (brandNum) {
      $scope.product.brand = brandNum;
    };

    $scope.data = [];

    $scope.deleteInputRow = function (index) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此条记录？'}
      }).then(
        function(value) {
          $scope.data.splice(index, 1);
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };
    $scope.editInputRow = function (d, index) {
      var editItem = {};
      angular.copy(d, editItem);
      ngDialog.openConfirm({
        template: 'views/provider/businessManage/modal/addInputRowModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddInputRowModalCtrl',
        data: {editItem: editItem}
      }).then(
        function(value) {
          if (value.color) {
            if (_.where($scope.data, {productNumber: value.productNumber, color: value.color}).length > 1) {
              toaster.pop('error', '面料货号和色号不能同时重复！');
              return;
            }
          }
          else {
            if (_.where($scope.data, {productNumber: value.productNumber}).length > 1) {
              toaster.pop('error', '面料货号和色号不能同时重复！');
              return;
            }
          }

          $scope.data[index] = value;
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };
    $scope.copyInputRow = function (d) {
      var editItem = {};
      angular.copy(d, editItem);
      $scope.data.push(editItem);
      console.log($scope.data)
      layer.tips('复制添加一个面料成功,请编辑它以保证各个条目的货色+色号的唯一性.', '#itemTable'); scrollTo('#itemTable');
    };

    $scope.addInputRow = function () {
      ngDialog.openConfirm({
        template: 'views/provider/businessManage/modal/addInputRowModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddInputRowModalCtrl'
      }).then(
        function(value) {
          var flag = false;
          angular.forEach($scope.data, function (item) {
            if (item.productNumber == value.productNumber && item.color == value.color) {
              flag = true;
            }
          });
          if (flag) {
            toaster.pop('error', '面料货号和色号不能同时重复！');
            return;
          }
          $scope.data.push(value);
          layer.tips('添加一个面料成功,可以删除或继续添加.', '#itemTable'); scrollTo('#itemTable');
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };

    $scope.submit = function () {
      if($scope.product.brand == undefined || $scope.product.brand == "") {
        layer.tips('面料品牌为必填项', '#selectBrand'); scrollTo('#selectBrand'); return false;
      }
      if($scope.product.fabricType == undefined || $scope.product.fabricType == "") {
        layer.tips('面料类型为必填项', '#selectType'); scrollTo('#selectType'); return false;
      }
      if($scope.data.length == 0) {
        toaster.pop('error', '产品条目不能为空，请添加条目！');
        return;
      }
      if($scope.data.length > 16) {
        toaster.pop('error', '一次产品条目不能超过16条，请删除一些条目！');
        return;
      }

      angular.forEach($scope.data, function (item) {
        if (item.color) {
          if (_.where($scope.data, {productNumber: item.productNumber, color: item.color}).length > 1) {
            toaster.pop('error', '条目中面料货号和色号不能同时重复, 请修改！');
            return;
          }
        }
        else {
          if (_.where($scope.data, {productNumber: item.productNumber}).length > 1) {
            toaster.pop('error', '条目中面料货号和色号不能同时重复, 请修改！');
            return;
          }
        }

        angular.extend(item, $scope.product);
      });

      var postData = [];
      angular.copy($scope.data, postData);
      angular.forEach(postData, function (item) {
        //item.stock = item.stock * 100; // m to cm
        //item.wholesaleLowerLimit = item.wholesaleLowerLimit * 100;
        delete item.priceSystems;
      });
      var postString = JSON.stringify(postData);
      console.log($scope.data);
      providerService.addProduct(postString).then(function (data) {
        if (data && data.success == true) {
          if (data.data.length > 0) {
            angular.forEach($scope.data[0].priceSystems, function (ps) {
              var psData = {};
              var i = 0;
              angular.forEach($scope.data, function (product) {
                i = i + 1;
                var productPs = _.findWhere(product.priceSystems, {number: ps.number});
                if (productPs && productPs.psPrice) {
                  psData[data.data[i-1]] = productPs.psPrice;
                }
              });
              if (!$.isEmptyObject(psData)) {
                providerService.updatePriceSystem(psData, ps.number).then(function (data) {
                  if (data && data.success == false) {
                    toaster.pop('warning', '产品价格体系设置有错误,请在"产品及价格"里修改价格体系.');
                  }
                });
              }
            })
          }
          toaster.pop('success', '产品添加成功！');
          $state.go('provider.businessManage.repertoryAndPrice',{},{inherit: false});
        }
        if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      })
    }

    var scrollTo = function (id) {
      $('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);
    }

  });


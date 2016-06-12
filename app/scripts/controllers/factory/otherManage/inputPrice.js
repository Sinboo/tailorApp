/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('InputPriceCtrl', function ($scope, $stateParams, factoryService, PRIVILEGE, CLOTHING_TYPE, tailoringTypes, ngDialog, toaster) {
    $scope.STATUS = $stateParams.STATUS;
    $scope.item = {};

    function initData() {
      factoryService.getPrices().then(function (data) {
        if (data && data.success == true) {
          if ($scope.STATUS == 'standard') {
            $scope.prices = data.data.quotations;
          }
          else if ($scope.STATUS == 'special') {
            $scope.prices = data.data.specQuotations;
          }
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      });
    }
    initData();

    $scope.addPrice = function (item) {
      if ($scope.validate()) {
        if ($scope.tailoringTypes.indexOf(item.tailoringType) === -1) {
          item.clothingTypes = 'OTHER';
          item.otherClothes = item.tailoringType;
        }
        else {
          item.clothingTypes = CLOTHING_TYPE[item.tailoringType];
        }
        delete item.tailoringType;

        if ($scope.STATUS == 'standard') {
          factoryService.addStandardPrice(item).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '增加工艺报价成功！');
              $scope.item = {};
              initData();
            }
            else if (data && data.success == false) {
              toaster.pop('error', data.error.message);
            }
          })
        }
        if ($scope.STATUS == 'special') {
          factoryService.addSpecialPrice(item).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '增加工艺报价成功！');
              $scope.item = {};
              initData();
            }
            else if (data && data.success == false) {
              toaster.pop('error', data.error.message);
            }
          })
        }
      }
    };
    
    $scope.deleteRow = function (price) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此工艺报价？'}
      }).then(
        function(value) {
          if ($scope.STATUS == 'standard') {
            factoryService.deleteStandardPrices(price.number).then(function (data) {
              if (data && data.success == true) {
                toaster.pop('success', '删除工艺报价成功！');
                initData();
              }
              else if (data && data.success == false) {
                toaster.pop('error', data.error.message);
              }
            })
          }
          if ($scope.STATUS == 'special') {
            factoryService.deleteSpecialPrices(price.number).then(function (data) {
              if (data && data.success == true) {
                toaster.pop('success', '删除工艺报价成功！');
                initData();
              }
              else if (data && data.success == false) {
                toaster.pop('error', data.error.message);
              }
            })
          }
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    };
    
    $scope.editRow = function (price) {
      ngDialog.openConfirm({
        template: 'views/factory/otherManage/modal/editPriceRow.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'EditPriceRowModalCtrl',
        data: {item: price, STATUS: $scope.STATUS}
      }).then(
        function(value) {
          if ($scope.STATUS == 'standard') {
            factoryService.updateStandardPrices(value, price.number).then(function (data) {
              if (data && data.success == true) {
                toaster.pop('success', '修改工艺报价成功！');
                initData();
              }
              else if (data && data.success == false) {
                toaster.pop('error', data.error.message);
              }
            })
          }
          if ($scope.STATUS == 'special') {
            factoryService.updateSpecialPrices(value, price.number).then(function (data) {
              if (data && data.success == true) {
                toaster.pop('success', '修改工艺报价成功！');
                initData();
              }
              else if (data && data.success == false) {
                toaster.pop('error', data.error.message);
              }
            })
          }
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    }

    $scope.getTailoringTypes = function(search) {
      var newTailoringTypes = $scope.tailoringTypes.slice();
      if (search && newTailoringTypes.indexOf(search) === -1) {
        newTailoringTypes.unshift(search);
      }
      return newTailoringTypes;
    };

    $scope.TailoringTypes = tailoringTypes;

    $scope.tailoringTypes = [
      '西服套装2ps(A+B)',
      '西服套装3ps(A+B+C)',
      '西服套装（A+2B）',
      '套装（A+C）',
      '套装（B+C）',
      '上衣A',
      '裤子B',
      '马甲C',
      '大衣E',
      '衬衫D',
      '礼服G',
      '夹克F'
    ];

    factoryService.getCrafts().then(function (data) {
      if (data && data.success == true) {
        if ($scope.STATUS == 'standard') {
          $scope.crafts = data.data.normalCrafts;
        }
        else if ($scope.STATUS == 'special') {
          $scope.crafts = data.data.specCrafts;
        }
      }
      else if (data && data.success == false) {
        toaster.pop('error', data.error.message);
      }
    });

    var beginDay = 1;
    $scope.days = [];
    for (var i = 0; i < 39 + 1; i++) {
      $scope.days.push(beginDay + i);
    }

    $scope.validate = function () {
      if($scope.STATUS == 'standard' && !$scope.item.tailoringType) {layer.tips('请选择定制项目', '#_clothing'); scrollTo('#_clothing'); return false;}
      if(!$scope.item.craft) {layer.tips('请选择工艺类型', '#_craft'); scrollTo('#_craft'); return false;}
      if($scope.STATUS == 'standard' && !$scope.item.days) {layer.tips('请选择工期天数', '#_days'); scrollTo('#_days'); return false;}
      if(!$scope.item.price) {layer.tips('请输入价格', '#_price'); scrollTo('#_price'); return false;}
      return true;
    };
    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};
    


  });

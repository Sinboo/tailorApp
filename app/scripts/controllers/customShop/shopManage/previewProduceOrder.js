/**
 * Created by wxb on 16/1/10.
 */
'use strict';

angular.module('tailorApp')
  .controller('PreviewProduceOrderCtrl', function (
    customShopService, $state, $stateParams, ngDialog, publicFunc, providerService, toaster,
    $scope, tailoringTypes,BREADTH, YARN_COUNT, CRAFT, COMPOSITION, FABRIC_COLOR, FLOWER_PATTERN, DRESSING_STYLE, NET_SIZE_A_PART,
    NET_SIZE_B_PART, NET_SIZE_C_PART, NET_SIZE_D_PART, NET_SIZE_E_PART, SHOULDER_TYPE, ARM_TYPE, ABDOMEN_TYPE,
    NECK_TYPE, HIP_TYPE, WAIST_HEIGHT, FIGURE_A_E_PART, FIGURE_B_PART, FIGURE_C_PART, FIGURE_D_PART, A_STYLE,
    B_STYLE, C_STYLE, D_STYLE, E_STYLE, OTHER_A_PART, OTHER_B_PART, OTHER_C_PART, OTHER_D_PART, OTHER_E_PART,
    A_E_POSITION, B_POSITION, C_POSITION, D_POSITION
  ) {

    if ($state.params.order == undefined && $stateParams.isFactory !== 'factory') {
      $state.go('tailor.shopManage.productionRecord', {STATUS: 'CONFIRM'}, {inherit: false});
    }

    if ($state.params.order == undefined && $stateParams.isFactory == 'factory') {
      $state.go('factory.produceManage.produceOrder', {STATUS: 'PLACED'}, {inherit: false});
    }

    $scope.isFactory = $stateParams.isFactory == 'factory';
    $scope.order = $state.params.order;
    $scope.tailoringTypes = tailoringTypes;
    $scope.produceDetails = {};
    $scope.isNaN = isNaN;
    $scope._ = _;

    $scope.bodySize = {};
    if ($scope.order && $scope.order.bodySize) {
      $scope.bodySize = $scope.order.bodySize.upperBody;
      angular.extend($scope.bodySize, $scope.order.bodySize.lowerBody);
    }

    $scope.bodyFigures = [];
    if ($scope.order && $scope.order.figure) {
      var figureObj = JSON.parse(JSON.stringify($scope.order.figure));
      $scope.bodyFigures = publicFunc.mapToArray(figureObj);
    }
    console.log($scope.bodyFigures);

    $scope.A_STYLE = publicFunc.mapToArray(A_STYLE);
    $scope.B_STYLE = publicFunc.mapToArray(B_STYLE);
    $scope.C_STYLE = publicFunc.mapToArray(C_STYLE);
    $scope.D_STYLE = publicFunc.mapToArray(D_STYLE);
    $scope.E_STYLE = publicFunc.mapToArray(E_STYLE);
    $scope.NET_SIZE_A_PART = publicFunc.mapToArray(NET_SIZE_A_PART);
    $scope.NET_SIZE_B_PART = publicFunc.mapToArray(NET_SIZE_B_PART);
    $scope.NET_SIZE_C_PART = publicFunc.mapToArray(NET_SIZE_C_PART);
    $scope.NET_SIZE_D_PART = publicFunc.mapToArray(NET_SIZE_D_PART);
    $scope.NET_SIZE_E_PART = publicFunc.mapToArray(NET_SIZE_E_PART);
    $scope.OTHER_A_PART = publicFunc.mapToArray(OTHER_A_PART);
    $scope.OTHER_B_PART = publicFunc.mapToArray(OTHER_B_PART);
    $scope.OTHER_C_PART = publicFunc.mapToArray(OTHER_C_PART);
    $scope.OTHER_D_PART = publicFunc.mapToArray(OTHER_D_PART);
    $scope.OTHER_E_PART = publicFunc.mapToArray(OTHER_E_PART);
    $scope.A_POSITION = publicFunc.mapToArray(A_E_POSITION);
    $scope.E_POSITION = publicFunc.mapToArray(A_E_POSITION);
    $scope.B_POSITION = publicFunc.mapToArray(B_POSITION);
    $scope.C_POSITION = publicFunc.mapToArray(C_POSITION);
    $scope.D_POSITION = publicFunc.mapToArray(D_POSITION);
    $scope.FIGURE_A_PART = FIGURE_A_E_PART;
    $scope.FIGURE_B_PART = FIGURE_B_PART;
    $scope.FIGURE_C_PART = FIGURE_C_PART;
    $scope.FIGURE_D_PART = FIGURE_D_PART;
    $scope.FIGURE_E_PART = FIGURE_A_E_PART;
    $scope.BODY_TYPE = {};
    $scope.BODY_TYPE.leftShoulder = publicFunc.mapToArray(SHOULDER_TYPE);
    $scope.BODY_TYPE.rightShoulder = publicFunc.mapToArray(SHOULDER_TYPE);
    $scope.BODY_TYPE.arm = publicFunc.mapToArray(ARM_TYPE);
    $scope.BODY_TYPE.abdomen = publicFunc.mapToArray(ABDOMEN_TYPE);
    $scope.BODY_TYPE.neck = publicFunc.mapToArray(NECK_TYPE);
    $scope.BODY_TYPE.hip = publicFunc.mapToArray(HIP_TYPE);
    $scope.BODY_TYPE.waist = publicFunc.mapToArray(WAIST_HEIGHT);

    var nameMap = {A: '西服上衣', B: '裤子', C: '马甲', D: '衬衫', E: '大衣'};

    $scope.types = [{shortName: false, fullName: '净尺寸和成衣尺寸'},{shortName: true, fullName: '净尺寸和号衣调整'}];

    $scope.dressingStyles = publicFunc.mapToArray(DRESSING_STYLE);
    console.log($scope.dressingStyles)


    $scope.settings = [];
    angular.forEach(['A','B','C','D','E'], function (i) {
      var item = {};
      if ($scope.order.produceDetails[i].useSpecification) {
        var params = {};
        params.ID = $scope.order.orderItem.factoryNumber;
        params.gender = $scope.order.bodySize.gender; //需要添加gender字段
        params.clothing = i;
        customShopService.factorySpecification(params).then(function (data) {
          if (data && data.success == true) {
            if (data.data.length > 0) {
              item.specifications = data.data;
              item.specification = _.findWhere(item.specifications, {number: $scope.order.produceDetails[i].specification.number});
              item.standardNames = Object.keys(item.specification.standard);
              item.model = $scope.order.produceDetails[i].model;
              item.NET_SIZE = $scope['NET_SIZE_' + i + '_PART'];
              angular.forEach(item.NET_SIZE, function (it) {
                if ($scope.order.produceDetails[i].useSpecification) {
                  it.alignment = $scope.order.produceDetails[i].alignment[it.shortName];
                  it.clothSize = item.specification.standard[item.model][it.shortName] + it.alignment; //计算成衣尺寸
                }
                else {
                  it.clothSize = $scope.order.produceDetails[i].garmentLowerSize[it.shortName] || $scope.order.produceDetails[i].garmentUpperSize[it.shortName];
                }
              });
            }
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message)
          }
        });
      }
      else {
        item.model = $scope.order.produceDetails[i].model;
        item.NET_SIZE = $scope['NET_SIZE_' + i + '_PART'];
        angular.forEach(item.NET_SIZE, function (it) {
          it.clothSize = $scope.order.produceDetails[i].garmentLowerSize[it.shortName] || $scope.order.produceDetails[i].garmentUpperSize[it.shortName.toLowerCase().indexOf('wrist') == -1 ? it.shortName : 'wrist'];
        })
      }

      item.dressingStyle = $scope.order.produceDetails[i].dressingStyle;
      item.remark = $scope.order.produceDetails[i].remark;
      item.figure_part = [];
      item.I = i;
      item.name = nameMap[i];
      item.OTHER_PART = $scope['OTHER_' + i + '_PART'];
      if ($scope.order.produceDetails[i].useSpecification) {
        angular.forEach(item.OTHER_PART, function (it) {
          it.alignment = $scope.order.produceDetails[i].alignment[it.fullName];
        });
      }
      item.FIGURE_PART = $scope['FIGURE_' + i + '_PART'];
      $.each(item.FIGURE_PART, function (k, v) {
        angular.forEach($scope.bodyFigures, function (b) {
          if (b.shortName == k && b.fullName !== false) {
            if(b.treatment = $scope.order.produceDetails[i].specFigure[b.shortName]) {
              b.treatment = $scope.order.produceDetails[i].specFigure[b.shortName].split(':')[1];
            }
            item.figure_part.push(b);
          }
        })
      });

      item.STYLE = $scope[i+'_STYLE'];
      angular.forEach(item.STYLE, function (s) {
        s.design = $scope.order.produceDetails[i].design[s.shortName];
      });
      item.POSITION = $scope[i + '_POSITION'];
      item.useSpecification = $scope.order.produceDetails[i].useSpecification ? [true] : [false];
      item.stitchworks = $scope.order.produceDetails[i].stitchworks;
      $scope.settings.push(item);
    });
    console.log($scope.settings);

    angular.forEach($scope.settings, function (set) {
      if (set.useSpecification[0]) {
        var params = {};
        params.ID = $scope.order.orderItem.factoryNumber;
        params.gender = $scope.order.bodySize.gender; //需要添加gender字段
        params.clothing = set.I;
        customShopService.factorySpecification(params).then(function (data) {
          if (data && data.success == true) {
            set.specifications = data.data;
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message)
          }
        });
      }
    });



    $scope.validate = function () {
      angular.forEach($scope.settings, function (item) {
        var produceDetail = {};
        produceDetail.remark = item.remark;
        produceDetail.dressingStyle = item.dressingStyle;
        produceDetail.design = {};
        angular.forEach(item.STYLE, function (a) {
          produceDetail.design[a.shortName] = a.design;
        });
        produceDetail.specFigure = {};
        angular.forEach(item.figure_part, function (a) {
          produceDetail.specFigure[a.shortName] = (!a.fullName && !a.treatment) ? undefined : (a.fullName ? a.fullName + ':' : '' ) + (a.treatment ? a.treatment : '' );
        });
        produceDetail.stitchworks = item.stitchworks;

        if (!item.useSpecification[0]) {
          produceDetail.garmentUpperSize = {};
          produceDetail.garmentLowerSize = {};
          if (item.I !== 'B') {
            angular.forEach(item.NET_SIZE, function (n) {
              produceDetail.garmentUpperSize[n.shortName] = n.clothSize;
            })
          }
          else {
            angular.forEach(item.NET_SIZE, function (n) {
              produceDetail.garmentLowerSize[n.shortName] = n.clothSize;
            })
          }
        }
        if (item.useSpecification[0]) {
          produceDetail.specification = item.specificationNumber;
          produceDetail.useSpecification = item.useSpecification[0];
          produceDetail.model = item.model;
          produceDetail.alignment = {};
          angular.forEach(item.NET_SIZE, function (n) {
            produceDetail.alignment[n.shortName] = n.alignment;
          });
          angular.forEach(item.OTHER_PART, function (n) {
            produceDetail.alignment[n.fullName] = n.alignment;
          });
        }
        $scope.produceDetails[item.I] = produceDetail;
      });
      return true;
    };

    $scope.confirmSize = function (order) {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/confirmSizeModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'ConfirmSizeModalCtrl',
        data: {order: order}
      }).then(function (value) {
        console.log(value);
        var param = {};
        param.bodySize = {};
        param.bodySize.lowerBody  = order.bodySize.lowerBody;
        param.bodySize.upperBody  = order.bodySize.upperBody;
        param.produceDetails = value;
        param = JSON.parse(JSON.stringify(param));
        console.log(param);
        customShopService.confirmSize(param, order.number).then(function (data) {
          if(data && data.success == true) {
            toaster.pop('success', '修改尺寸成功！');
            $state.go('tailor.shopManage.productionRecord', {STATUS: 'CONFIRM'}, {inherit: false});
          }
          else if (data && data.error) {
            toaster.pop('warning', data.error.message);
          }
        })
      }, function (value) {

      })
    };
    
    $scope.submitOrder = function (order) {
      customShopService.submitProduceOrder(order.number).then(function (data) {
        if(data && data.success == true) {
          toaster.pop('success', '提交订单成功！');
          $state.go('tailor.shopManage.productionRecord', {STATUS: 'CONFIRM'}, {inherit: false});
        }
        else if (data && data.error) {
          toaster.pop('warning', data.error.message);
        }
      })
    }

  });

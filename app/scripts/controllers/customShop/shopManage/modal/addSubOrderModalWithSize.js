/**
 * Created by wxb on 16/1/10.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddSubOrderModalCtrlWithSize', function ($scope, customShopService, ngDialog, publicFunc, providerService, toaster,
          BREADTH, YARN_COUNT, CRAFT, COMPOSITION, FABRIC_COLOR, FLOWER_PATTERN, DRESSING_STYLE, NET_SIZE_A_PART,
          NET_SIZE_B_PART, NET_SIZE_C_PART, NET_SIZE_D_PART, NET_SIZE_E_PART, SHOULDER_TYPE, ARM_TYPE, ABDOMEN_TYPE,
          NECK_TYPE, HIP_TYPE, WAIST_HEIGHT, FIGURE_A_E_PART, FIGURE_B_PART, FIGURE_C_PART, FIGURE_D_PART, A_STYLE,
          B_STYLE, C_STYLE, D_STYLE, E_STYLE, OTHER_A_PART, OTHER_B_PART, OTHER_C_PART, OTHER_D_PART, OTHER_E_PART,
          A_E_POSITION, B_POSITION, C_POSITION, D_POSITION, SPECIAL_TYPE) {


    $scope.bodySize = {};
    if ($scope.ngDialogData.order && $scope.ngDialogData.order.bodySize) {
      $scope.bodySize = $scope.ngDialogData.order.bodySize.upperBody;
      angular.extend($scope.bodySize, $scope.ngDialogData.order.bodySize.lowerBody);
    }

    $scope.bodyFigures = [];
    if ($scope.ngDialogData.order && $scope.ngDialogData.order.figure) {
      var figureObj = JSON.parse(JSON.stringify($scope.ngDialogData.order.figure));
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

    if ($scope.ngDialogData.editItem) {
      $scope.item = $scope.ngDialogData.editItem;
      console.log($scope.item);
      $scope.fabric = _.findWhere($scope.ngDialogData.fabrics, {number: $scope.ngDialogData.editItem.purchaseOrder.supplierNumber});
      $scope.brands = $scope.fabric.brands;
      if ($scope.ngDialogData.editItem.editFlag) {
        $scope.brand = _.findWhere($scope.fabric.brands, {number: $scope.ngDialogData.editItem.purchaseOrder.brand.number});
        $scope.factory = {};
        $scope.factory.shortName = $scope.item.factoryName;
        $scope.factory.number = $scope.item.factoryNumber;
        $scope.item.urgent = $scope.item.urgent.toString();
        $scope.item.halfFinished = $scope.item.halfFinished.toString();
      }
      else {
        $scope.factory = {};
        $scope.factory.shortName = _.findWhere($scope.ngDialogData.factories, {number: $scope.item.factoryNumber}).shortName;
        $scope.factory.number = $scope.item.factoryNumber;
        $scope.brand = _.findWhere($scope.fabric.brands, {number: $scope.ngDialogData.editItem.purchaseOrder.brand});
      }

      $scope.settings = [];
      angular.forEach(['A','B','C','D','E'], function (i) {
        var item = {};
        if ($scope.item.produceOrder.produceDetails[i].useSpecification) {
          var params = {};
          params.ID = $scope.item.factoryNumber;
          params.gender = $scope.ngDialogData.order.gender;
          params.clothing = i;
          customShopService.factorySpecification(params).then(function (data) {
            if (data && data.success == true) {
              if (data.data.length > 0) {
                item.specifications = data.data;
                if ($scope.ngDialogData.editItem.editFlag) {
                  item.specification = _.findWhere(item.specifications, {number: $scope.item.produceOrder.produceDetails[i].specification.number});
                }
                else {
                  item.specification = _.findWhere(item.specifications, {number: $scope.item.produceOrder.produceDetails[i].specification});
                }
                console.log(item.specification)
                item.standardNames = Object.keys(item.specification.standard);
                item.model = $scope.item.produceOrder.produceDetails[i].model;
                item.NET_SIZE = $scope['NET_SIZE_' + i + '_PART'];
                angular.forEach(item.NET_SIZE, function (it) {
                  if ($scope.item.produceOrder.produceDetails[i].useSpecification) {
                    it.alignment = $scope.item.produceOrder.produceDetails[i].alignment[it.shortName];
                    it.clothSize = item.specification.standard[item.model][it.shortName] + it.alignment; //计算成衣尺寸
                  }
                  else {
                    it.clothSize = $scope.item.produceOrder.produceDetails[i].garmentLowerSize[it.shortName] || $scope.item.produceOrder.produceDetails[i].garmentUpperSize[it.shortName];
                  }
                });
              }
            }
            else if (data && data.success == false) {
              toaster.pop('error', data.error.message)
            }
          });
        }

        item.dressingStyle = $scope.item.produceOrder.produceDetails[i].dressingStyle;
        item.remark = $scope.item.produceOrder.produceDetails[i].remark;
        item.figure_part = [];
        item.I = i;
        item.name = nameMap[i];
        item.OTHER_PART = $scope['OTHER_' + i + '_PART'];
        if ($scope.item.produceOrder.produceDetails[i].useSpecification) {
          angular.forEach(item.OTHER_PART, function (it) {
            it.alignment = $scope.item.produceOrder.produceDetails[i].alignment[it.fullName];
          });
        }
        item.FIGURE_PART = $scope['FIGURE_' + i + '_PART'];
        $.each(item.FIGURE_PART, function (k, v) {
          angular.forEach($scope.bodyFigures, function (b) {
            if (b.shortName == k) {
              if(b.treatment = $scope.item.produceOrder.produceDetails[i].specFigure[b.shortName]) {
                b.treatment = $scope.item.produceOrder.produceDetails[i].specFigure[b.shortName].split(':')[1];
              }
              item.figure_part.push(b);
            }
          })
        });

        item.STYLE = $scope[i+'_STYLE'];
        angular.forEach(item.STYLE, function (s) {
          s.design = $scope.item.produceOrder.produceDetails[i].design[s.shortName];
        });
        item.POSITION = $scope[i + '_POSITION'];
        item.useSpecification = $scope.item.produceOrder.produceDetails[i].useSpecification ? [true] : [false];
        item.stitchworks = $scope.item.produceOrder.produceDetails[i].stitchworks;
        $scope.settings.push(item);
      });
      console.log($scope.settings)
    }
    else {
      $scope.item = {};
      $scope.item.quantity = 1;
      $scope.item.purchaseOrder = {};
      $scope.item.produceOrder = {};
      $scope.item.produceOrder.produceDetails = {};

      $scope.settings = [];
      angular.forEach(['A','B','C','D','E'], function (i) {
        var item = {};
        item.figure_part = [];
        item.I = i;
        item.name = nameMap[i];
        item.OTHER_PART = $scope['OTHER_' + i + '_PART'];
        angular.forEach(item.OTHER_PART, function (it) {it.alignment = 0;});
        item.NET_SIZE = $scope['NET_SIZE_' + i + '_PART'];
        angular.forEach(item.NET_SIZE, function (it) {it.alignment = 0;});
        item.FIGURE_PART = $scope['FIGURE_' + i + '_PART'];
        $.each(item.FIGURE_PART, function (k, v) {
          angular.forEach($scope.bodyFigures, function (b) {
            if (b.shortName == k) {
              item.figure_part.push(b);
            }
          })
        });
        item.STYLE = $scope[i+'_STYLE'];
        item.POSITION = $scope[i + '_POSITION'];
        item.useSpecification = [false];
        item.stitchworks = [];
        $scope.settings.push(item);
      });
      console.log($scope.settings)
    }

    $scope.types = [{shortName: false, fullName: '净尺寸和成衣尺寸'},{shortName: true, fullName: '净尺寸和号衣调整'}];

    $scope.choose = function (business, set) {
      if (set.useSpecification.indexOf(business) === -1) {
        set.useSpecification = [];
        set.useSpecification.push(business.shortName);
      }
      else {
        set.useSpecification.pop();
      }
      console.log(set.useSpecification);

      if (set.useSpecification[0]) {
        var params = {};
        params.ID = $scope.item.factoryNumber;
        params.gender = $scope.ngDialogData.order.gender;
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
    };

    $scope.setSpecification = function (specification, set) {
      var speci = JSON.parse(specification)
      console.log(specification);
      set.specificationNumber = speci.number;
      $scope.standards = speci.standard;
      set.standardNames = Object.keys($scope.standards);
    };

    $scope.setStandard = function (standardName, NET_SIZE) {
      $scope.standard = $scope.standards[standardName];
      console.log($scope.standard);
      angular.forEach(NET_SIZE, function (item) {
        item.clothSize = $scope.standard[item.shortName];
      });
    };

    $scope.inputTreatment = function (A) {
      console.log(A);
      ngDialog.openConfirm({
        template: 'views/common/modal/inputModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'InputModalCtrl',
        data: {inputText: A.treatment}
      }).then(
        function (value) {
          A.treatment = value;
        },
        function () {

        }
      )
    };

    $scope.addEmbroidery = function (set) {
      ngDialog.openConfirm({
        template: 'views/customShop/shopManage/modal/addEmbroideryModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddEmbroideryModalCtrl',
        data: {POSITION: set.POSITION}
      }).then(
        function (value) {
          console.log(value)
          set.stitchworks.push(value);
        },
        function () {

        }
      )
    };

    $scope.yarnCounts = YARN_COUNT;
    $scope.breadths = BREADTH;
    $scope.compositions = COMPOSITION;
    $scope.fabricColors = FABRIC_COLOR;
    $scope.figures = FLOWER_PATTERN;
    $scope.crafts = CRAFT;

    $scope.dressingStyles = publicFunc.mapToArray(DRESSING_STYLE);

    $scope.getTailoringTypes = function(search) {
      var newTailoringTypes = $scope.tailoringTypes.slice();
      if (search && newTailoringTypes.indexOf(search) === -1) {
        newTailoringTypes.unshift(search);
      }
      return newTailoringTypes;
    };

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



    $scope.setFabric = function (fabric) {
      $scope.item.purchaseOrder.supplierName = fabric.shortName;
      $scope.item.purchaseOrder.supplierNumber = fabric.number;
      $scope.brands = fabric.brands;
    }

    $scope.setBrand = function (brand) {
      $scope.item.purchaseOrder.brand = brand.number;
    }

    $scope.setFactory = function (factory) {
      $scope.item.factoryNumber = factory.number;
    }

    $scope.keyPress = function (e) {
      if(e.keyCode == 13) {
        $scope.getFabricsByProductNumber($scope.item.purchaseOrder.productNumber);
      }
    };

    $scope.getFabricsByProductNumber = function(productNumber) {
      var queryParams = {};
      queryParams.productNumber = productNumber == "" ? undefined : productNumber;
      queryParams.id = $scope.item.purchaseOrder.supplierNumber == "" ? undefined : $scope.item.purchaseOrder.supplierNumber;
      queryParams = JSON.parse(JSON.stringify(queryParams));
      console.log(queryParams)
      customShopService.queryFabric(queryParams).then(function (data) {
        var productList = [];
        angular.forEach(data.data, function (item) {
          if (item.salesStatus == 'NORMAL') {
            productList.push(item);
          }
        });
        $scope.queriedProducts = productList;
      })
    };

    $scope.setQueriedProduct = function (product) {
      //if (product.color) {
      $scope.item.purchaseOrder.color = product.color;
      $scope.item.purchaseOrder.breadth = product.breadth;
      $scope.item.purchaseOrder.composition = product.composition;
      $scope.item.purchaseOrder.yarnCount = product.yarnCount;
      $scope.item.purchaseOrder.colorDesc = product.colorDesc;
      $scope.item.purchaseOrder.figure = product.figure;

      $scope.disable_breadth = product.breadth !== null;
      $scope.disable_composition = product.composition !== null;
      $scope.disable_yarnCount = product.yarnCount !== null;
      $scope.disable_colorDesc = product.colorDesc !== null;
      $scope.disable_figure = product.figure !== null;

      $scope.stock = product.stock;
      $scope.salesStatus = product.salesStatus;
      //}
    }

    $scope.checkOutOfStock = function (value) {
      $scope.outOfStock = value > $scope.stock;
    };

    $scope.validate = function () {
      if($scope.outOfStock) {layer.msg('数量超库存了!', {offset: 0, shift: 6}); return false;}
      if($scope.salesStatus == 'OOS') {layer.msg('所选产品缺货!', {offset: 0, shift: 6}); return false;}
      if(!$scope.item.purchaseOrder.supplierNumber) {layer.msg('请设置面料供应商!', {offset: 0, shift: 6}); return false;}
      if(!$scope.item.factoryNumber) {layer.msg('请设置工厂!', {offset: 0, shift: 6}); return false;}
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
        $scope.item.produceOrder.produceDetails[item.I] = produceDetail;
      });
      console.log('item:');
      console.log($scope.item);
      $scope.item = JSON.parse(JSON.stringify($scope.item));
      console.log($scope.item);
      return true;
    };

    $(document).on("click", ".setItemComingDate", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.setItemComingDate');
          input.val(date);
          input.trigger('input');
        }
      });
    })


  })

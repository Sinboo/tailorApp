/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddOrderRecordWithSizeCtrl', function ($scope, ngDialog, $state, publicFunc, $stateParams, CLOTHING_TYPE, tailoringTypes, commonService, customShopService, providerService, toaster, DRESSING_STYLE, FIGURE_TYPE, SHOULDER_TYPE, ARM_TYPE, ABDOMEN_TYPE, NECK_TYPE, HIP_TYPE, WAIST_HEIGHT, SPECIAL_TYPE, SPECIFICATION_GENDER) {
    if ($stateParams.ID) {
      $scope.editFlag = true;
      customShopService.orderDetail($stateParams.ID).then(function (data) {
        $scope.order = data.data;
        $scope.data = data.data.items;

        $scope.specialTypeList = [];
        $.each($scope.order.figure, function(k, v){
          if (_.has(SPECIAL_TYPE, k)) {
            if (v) {
              $scope.specialTypeList.push(k);
            }
          }
        });
        $scope.order.birthday = commonService.convertDate($scope.order.birthday).split('-')[0];
        $scope.order.purharseDate = commonService.convertDate($scope.order.purharseDate);
        angular.forEach($scope.data, function (item) {
          item.deliveryDate = commonService.convertDate(item.deliveryDate);
          item.editFlag = true;
          item.tailoringType = item.clothingTypes=='OTHER' ? item.otherClothes : tailoringTypes[item.clothingTypes.toString()]
        });

        $scope.uploadImages = $scope.order.figure.photos;
      });
    }
    else {
      $scope.order = {};
      $scope.specialTypeList = [];
      $scope.data = [];
      $scope.order.birthday = '无';
      $scope.uploadImages = [];
    }

    $scope.genders = publicFunc.mapToArray(SPECIFICATION_GENDER);
    $scope.dressingStyles = publicFunc.mapToArray(DRESSING_STYLE);
    $scope.figureTypes = publicFunc.mapToArray(FIGURE_TYPE);
    $scope.shoulderTypes = SHOULDER_TYPE;
    $scope.armTypes = ARM_TYPE;
    $scope.abdomenTypes = ABDOMEN_TYPE;
    $scope.neckTypes = NECK_TYPE;
    $scope.hipTypes = HIP_TYPE;
    $scope.waistHeights = WAIST_HEIGHT;
    $scope.specialTypes = publicFunc.mapToArray(SPECIAL_TYPE);

    $scope.item = {};
    $scope.item.quantity = 1;
    $scope.item.purchaseOrder = {};
    $scope.item.produceOrder = {};

    var beginYear = 1940;
    $scope.ages = [];
    for (var i = 0; i < 76 + 1; i++) {
      $scope.ages.push(beginYear + i);
    }
    $scope.ages.push('无');

    customShopService.fabricPartners().then(function (data) {
      $scope.fabrics = data.data;
    });
    customShopService.factoryPartners().then(function (data) {
      $scope.factories = data.data;
      console.log($scope.factories)
    });
    customShopService.privateFabrics().then(function (data) {
      $scope.privateFabrics = data.data;
    });

    $scope.getWeChatOrderNumber = function (customerName) {
      var param = {};
      param.customerName = customerName;
      customShopService.getWeChatOrderNumber(param).then(function (data) {
        if (data && data.success == true) {
          $scope.order.WeChatOrderNumber = data.data;
        }
      })
    };


    $scope.choose = function () {
      angular.forEach($scope.specialTypeList, function(spec) {
        $scope.order.figure[spec] = true;
      });
    }

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
        template: 'views/customShop/shopManage/modal/addInputRowModalWithSize.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddSubOrderModalCtrlWithSize',
        data: {fabrics: $scope.fabrics, factories: $scope.factories, editItem: editItem, order: $scope.order  }
      }).then(
        function(value) {
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
    };


    $scope.addInputRow = function () {
      ngDialog.openConfirm({
        template: "views/customShop/shopManage/modal/addOrderChooseModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor'
      }).then(function (value) {
        ngDialog.openConfirm({
          template: 'views/customShop/shopManage/modal/addInputRowModalNoPlatform.html',
          className: 'ngdialog-theme-default dialogcaseeditor',
          controller: 'AddSubOrderModalCtrlNoPlatform',
          data: {fabrics: $scope.privateFabrics, factories: $scope.factories, order: $scope.order }
        }).then(
          function(value) {
            $scope.data.push(value);
          },
          function(value) {
            //Cancel or do nothing
          }
        );
      }, function (value) {
        if (value == 'platform') {
          console.log($scope.order)
          ngDialog.openConfirm({
            template: 'views/customShop/shopManage/modal/addInputRowModalWithSize.html',
            className: 'ngdialog-theme-default dialogcaseeditor',
            controller: 'AddSubOrderModalCtrlWithSize',
            data: {fabrics: $scope.fabrics, factories: $scope.factories,  order: $scope.order }
          }).then(
            function(value) {
              $scope.data.push(value);
            },
            function(value) {
              //Cancel or do nothing
            }
          );
        }
      })

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

    $scope.disable = false;

    $scope.submitOrder = function () {
      if(!valid()){
        return;
      }

      $scope.order.figure.photos = $scope.uploadImages;

      var items = $scope.data;
      console.log(items);
      angular.forEach(items, function (item) {
        if ($scope.tailoringTypes.indexOf(item.tailoringType) === -1) {
          item.clothingTypes = 'OTHER';
          item.otherClothes = item.tailoringType;
        }
        else {
          item.clothingTypes = CLOTHING_TYPE[item.tailoringType];
        }
        delete item.tailoringType;
      });
      var postData = angular.extend($scope.order, {items: items});
      postData.birthday = postData.birthday == '无' ? undefined : postData.birthday + '-01-01';
      var postString = JSON.stringify(postData);
      console.log(postString);
      $scope.disable = true;
      if ( $scope.editFlag ) {
        customShopService.editOrder(postString, $scope.order.number).then(function (data) {
          console.log(data);
          if (data && data.success == true) {
            toaster.pop('success', '修改订单成功!');
            $state.go('tailor.shopManage.orderRecord', {STATUS: 'DOING'});
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message );
            $scope.disable = false;
          }
          else {
            toaster.pop('error', '修改订单失败!');
            $scope.disable = false;
          }
        })
      }
      else if ($scope.order.WeChatOrderNumber !== null) {
        customShopService.editOrder(postString, $scope.order.WeChatOrderNumber).then(function (data) {
          console.log(data);
          if (data && data.success == true) {
            toaster.pop('success', '修改订单成功!');
            $state.go('tailor.shopManage.orderRecord', {STATUS: 'DOING'});
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message );
            $scope.disable = false;
          }
          else {
            toaster.pop('error', '修改订单失败!');
            $scope.disable = false;
          }
        })
      }
      else {
        customShopService.addOrderV2(postString).then(function (data) {
          console.log(data);
          if (data && data.success == true) {
            toaster.pop('success', '添加订单成功!');
            $state.go('tailor.shopManage.orderRecord', {STATUS: 'DOING'});
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message );
            $scope.disable = false;
          }
          else {
            toaster.pop('error', '添加订单失败!');
            $scope.disable = false;
          }
        })
      }

    };

    var valid = function() {
      if (!$scope.order.customerName) {layer.tips('姓名不能为空', '#doc-ipt-31'); scrollTo('#doc-ipt-31'); return false;}
      if (!$scope.order.bodySize.height) {layer.tips('身高不能为空', '#_height'); scrollTo('#_height'); return false;}
      if (!$scope.order.bodySize.weight) {layer.tips('体重不能为空', '#_weight'); scrollTo('#_weight'); return false;}
      if ($scope.data.length == 0) {layer.tips('子订单不能为空', '#addItem'); scrollTo('#daddItem'); return false;}
      return true;
    };
    var scrollTo = function (id) {
      $('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);
    };

    $(document).on("click", ".setOrderPurchaseDate", function() {
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.setOrderPurchaseDate');
          input.val(date);
          input.trigger('input');
        }
      });
    });

    //multi images upload
    var options = {
      'bucket': 'imtailor',
      'save-key': '/{year}/{mon}/{day}/{filemd5}{.suffix}',
      'expiration': Math.floor(new Date().getTime() / 1000) + 86400
    };
    var policy = window.btoa(JSON.stringify(options));
    var form_api_secret = 'ZeJhPE68fuX7jRkPMeFXOOyBl40=';
    var signature = md5(policy + '&' + form_api_secret);

    //$scope.fileUpload = {
    //  url : 'http://v0.api.upyun.com/' + options.bucket,
    //  options: {
    //    browse_button : 'pickfiles', // you can pass in id...
    //    container: document.getElementById('container'), // ... or DOM Element itself
    //    multipart_params: {
    //      'Filename': '${filename}', // adding this to keep consistency across the runtimes
    //      'Content-Type': '',
    //      'policy': policy,
    //      'signature': signature
    //    }
    //  },
    //  callbacks: {
    //    PostInit: function () {
    //      document.getElementById('filelist').innerHTML = '';
    //
    //      document.getElementById('uploadfiles').onclick = function () {
    //        uploader.start();
    //        return false;
    //      };
    //    },
    //
    //    FilesAdded: function (up, files) {
    //      if (files.length > 6) {
    //        alert('图片张数应小于6张');
    //      }
    //      else {
    //        plupload.each(files, function (file) {
    //          document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
    //        });
    //      }
    //    },
    //
    //    UploadProgress: function (up, file) {
    //      document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
    //    },
    //
    //    FileUploaded: function (up, file, info) {
    //      var response = JSON.parse(info.response);
    //      $scope.uploadImages.push('http://imtailor.b0.upaiyun.com' + response.url);
    //      //$scope.$apply();
    //    },
    //
    //    Error: function (up, err) {
    //      document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
    //    }
    //  }
    //}

    var uploader = new plupload.Uploader({
      runtimes : 'html5,flash,silverlight,html4',
      browse_button : 'pickfiles', // you can pass in id...
      container: document.getElementById('container'), // ... or DOM Element itself
      flash_swf_url: '/bower_components/plupload/js/Moxie.swf',
      silverlight_xap_url: '/bower_components/plupload/js/Moxie.xap',
      url : 'http://v0.api.upyun.com/' + options.bucket,
      multipart_params: {
        'Filename': '${filename}', // adding this to keep consistency across the runtimes
        'Content-Type': '',
        'policy': policy,
        'signature': signature
      },

      init: {
        PostInit: function () {
          document.getElementById('filelist').innerHTML = '';

          document.getElementById('uploadfiles').onclick = function () {
            uploader.start();
            return false;
          };
        },

        FilesAdded: function (up, files) {
          if (files.length > 6) {
            alert('图片张数应小于6张');
          }
          else {
            plupload.each(files, function (file) {
              document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
            });
          }
        },

        UploadProgress: function (up, file) {
          document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
        },

        FileUploaded: function (up, file, info) {
          var response = JSON.parse(info.response);
          $scope.uploadImages.push('http://imtailor.b0.upaiyun.com' + response.url);
          $scope.$apply();
        },

        Error: function (up, err) {
          document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
        }
      }
    });

    uploader.init();

    $scope.deleteImage = function (index) {
      ngDialog.openConfirm({
        template: 'views/common/modal/confirmModal.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        data: {message: '您确定要删除此张图片？'}
      }).then(
        function(value) {
          $scope.uploadImages.splice(index, 1);
          document.getElementById('filelist').innerHTML = '';
        },
        function(value) {
          //Cancel or do nothing
        }
      );
    }



  });

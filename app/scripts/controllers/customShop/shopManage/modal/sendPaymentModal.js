/**
 * Created by wxb on 16/2/5.
 */
'use strict';

angular.module('tailorApp')
  .controller('SendPaymentModalCtrl', function ($scope, upyun, localStorageService, rfc4122) {



    //upload image
    $scope.chooseImage = function (event) {
      $scope.imgChoosed = true;
      if ($scope.uploadText === '上传完成') {
        $scope.uploadText = '重新上传'
      }
    }

    $scope.uploadText = '上传付款凭证图片';
    upyun.on('uploading', function(progress) {
      $scope.uploadText =
        progress === 100 ?
          '上传完成' :
        '上传进度: ' + progress + '%';
      $scope.$apply();
    });

    $scope.upload = function() {
      if(!$scope.imgChoosed) {layer.msg('请选择要上传的图片', {offset: 0, shift: 6}); return false;}
      var merchantNumber = localStorageService.cookie.get('user').merchantNumber;
      var supplierNumber = $scope.ngDialogData.bill.supplierNumber;
      var uuidString = rfc4122.v4();
      var last = '{.suffix}';
      var imgUrl = '/' + merchantNumber +'/'+ supplierNumber +'/'+ '{year}/{mon}' +'/'+ uuidString + last;
      upyun.set('save-key', imgUrl);
      upyun.upload('uploadForm', function(err, response, image){
        if (err) console.error(err);
        if (image.code === 200 && image.message === 'ok') {
          $scope.image = {};
          $scope.image.ready = true;
          $scope.image.url = image.absUrl;
          console.log($scope.image.url)
        }
        $scope.$apply();
      });
    }

    $scope.deleteImage = function () {
      $scope.image.url = "";
      $scope.image.ready = false;
      if ($scope.uploadText === '上传完成') {
        $scope.uploadText = '重新上传'
      }
    };

    $scope.validate = function () {
      if(!$scope.image || !$scope.image.url || $scope.image.url == "") {layer.msg('请上传付款凭证图片.', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

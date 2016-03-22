/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('ReturnFactoryModalCtrl', function ($scope, upyun, localStorageService, EXPRESS_COM) {
    $scope.expressComs = EXPRESS_COM;

    $scope.modalData = {};
    $scope.modalData.image = {};
    $scope.modalData.image.url = [];
    $scope.modalData.orderItem = {};

    $scope.setFactory = function (factory) {
      $scope.modalData.orderItem.factoryNumber = factory.number;
    }

    $(document).on("click", ".expectDeliveryDay", function(){
      laydate({
        //istime: true,
        format: 'YYYY-MM-DD',
        festival: true,
        choose: function (date) {
          var input = $('.expectDeliveryDay');
          input.val(date);
          input.trigger('input');
        }
      });
    })

    $scope.chooseImage = function (event) {
      $scope.choosed = true;
      if ($scope.uploadText === '上传完成') {
        $scope.uploadText = '继续上传'
      }
    }

    $scope.uploadText = '上传';
    upyun.on('uploading', function(progress) {
      $scope.uploadText =
        progress === 100 ?
          '继续上传' :
        '上传进度: ' + progress + '%';
      $scope.$apply();
    });

    $scope.upload = function() {
      if(!$scope.choosed) {layer.msg('请选择要上传的图片', {offset: 0, shift: 6}); return false;}
      var merchantNumber = localStorageService.cookie.get('user').merchantNumber;
      var productNumber = '返厂附图';
      var last = '{filename}{.suffix}';
      var imgUrl = '/' + merchantNumber +'/'+ productNumber +'/'+ last;
      upyun.set('save-key', imgUrl);
      upyun.upload('uploadForm', function(err, response, image){
        if (err) console.error(err);
        if (image.code === 200 && image.message === 'ok') {
          $scope.modalData.image.ready = true;
          $scope.modalData.image.url.push(image.absUrl);
        }
        $scope.$apply();
      });
    }

    $scope.deleteImage = function (index) {
      console.log(index)
      $scope.modalData.image.url.splice(index, 1);
      if ($scope.modalData.image.url.length == 0) {
        $scope.modalData.image.ready = false;
      }
    };

    $scope.validate = function () {
      if(!$scope.modalData.orderItem.factoryNumber) {layer.msg('请选择工厂.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.expectDeliveryDay) {layer.msg('请填预计交货日期.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.toFactoryExpress.company) {layer.msg('请选择快递公司.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.toFactoryExpress.number) {layer.msg('请填写快递单号.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.placeRemark) {layer.msg('请填写返厂意见.', {offset: 0, shift: 6}); return false;}
      if(!($scope.modalData.image && $scope.modalData.image.url)  || $scope.modalData.image.url == "") {layer.msg('请上传返厂情况附图.', {offset: 0, shift: 6}); return false;}
      return true;
    }


  });

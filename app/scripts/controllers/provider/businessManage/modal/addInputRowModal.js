/**
 * Created by wxb on 16/1/20.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddInputRowModalCtrl', function ($scope, upyun, localStorageService, providerService, FABRIC_UNIT, CURRENCY, FABRIC_COLOR, CRAFT, GRAM_WEIGHT, FLOWER_PATTERN, ORIGIN_PLACE, BREADTH, YARN_COUNT, COMPOSITION) {
    if ($scope.ngDialogData && $scope.ngDialogData.editItem) {
      $scope.modalData = $scope.ngDialogData.editItem;
      $scope.modalData.image = {ready: true, url: $scope.ngDialogData.editItem.imageUrl};
      $scope.priceSystems = $scope.ngDialogData.editItem.priceSystems;
    }
    else {
      $scope.modalData = {};
      $scope.modalData.image = {};
      providerService.getPriceSystems().then(function (priceSystems) {
        $scope.priceSystems = priceSystems.data;
      });
    }

    $scope.FABRIC_UNIT = FABRIC_UNIT;
    $scope.CURRENCY = CURRENCY;
    $scope.currency = localStorageService.cookie.get('user').currency;
    $scope.fabricUnit = localStorageService.cookie.get('user').fabricUnit;


    $scope.fabricColors = FABRIC_COLOR;
    $scope.figures = FLOWER_PATTERN;
    $scope.madeIns = ORIGIN_PLACE;
    $scope.breadths = BREADTH;
    $scope.yarnCounts = YARN_COUNT;
    $scope.compositions = COMPOSITION;

    $scope.weights = [];
    $.each(GRAM_WEIGHT, function (key, value) {
      var typeItem = {};
      typeItem.name = key;
      typeItem.value = value;
      $scope.weights.push(typeItem);
    });


    $scope.chooseImage = function (event) {
      $scope.choosed = true;
      if ($scope.uploadText === '上传完成') {
        $scope.uploadText = '重新上传'
      }
    }

    $scope.uploadText = '上传';
    upyun.on('uploading', function(progress) {
      $scope.uploadText =
        progress === 100 ?
          '上传完成' :
        '上传进度: ' + progress + '%';
      $scope.$apply();
    });

    $scope.upload = function() {
      if(!$scope.modalData.productNumber) {layer.msg('请填写面料货号.', {offset: 0, shift: 6}); return false;}
      if(!$scope.choosed) {layer.msg('请选择要上传的图片', {offset: 0, shift: 6}); return false;}
      var merchantNumber = localStorageService.cookie.get('user').merchantNumber;
      var productNumber = $scope.modalData.productNumber;
      var last = '{filename}{.suffix}';
      if ($scope.modalData.color) {
        var imgUrl = '/' + merchantNumber +'/'+ productNumber +'/'+ $scope.modalData.color +'/'+ last;
      }
      else {
        var imgUrl = '/' + merchantNumber +'/'+ productNumber +'/'+ last;
      }
      upyun.set('save-key', imgUrl);
      upyun.upload('uploadForm', function(err, response, image){
        if (err) console.error(err);
        if (image.code === 200 && image.message === 'ok') {
          $scope.modalData.image = {};
          $scope.modalData.image.ready = true;
          $scope.modalData.image.url = image.absUrl;
        }
        $scope.$apply();
      });
    }

    $scope.deleteImage = function () {
      $scope.modalData.image.url = "";
      $scope.modalData.image.ready = false;
      if ($scope.uploadText === '上传完成') {
        $scope.uploadText = '重新上传'
      }
    }

    $scope.validate = function () {
      var flag;
      if(!$scope.modalData.productNumber) {layer.msg('请填写面料货号.', {offset: 0, shift: 6}); return false;}
      //if(!$scope.modalData.color) {layer.msg('请填写面料色号.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.composition) {layer.msg('请填写面料成分.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.yarnCount) {layer.msg('请填写纱支.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.stock) {layer.msg('请填写库存.', {offset: 0, shift: 6}); return false;}
      if(isNaN($scope.modalData.stock)) {layer.msg('库存必须为数字.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.retailPrice) {layer.msg('请填写零剪价格.', {offset: 0, shift: 6}); return false;}
      if(isNaN($scope.modalData.retailPrice)) {layer.msg('零剪价格必须为数字.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.wholesalePrice) {layer.msg('请填写批发价格.', {offset: 0, shift: 6}); return false;}
      if(isNaN($scope.modalData.wholesalePrice)) {layer.msg('批发价格必须为数字.', {offset: 0, shift: 6}); return false;}
      if(!$scope.modalData.wholesaleLowerLimit) {layer.msg('请填写批发起点米数.', {offset: 0, shift: 6}); return false;}
      if(isNaN($scope.modalData.wholesaleLowerLimit)) {layer.msg('批发起点米数必须为数字.', {offset: 0, shift: 6}); return false;}
      for (var i = 0; i < $scope.priceSystems.length; i++) {
        if (!$scope.priceSystems[i].psPrice) {
          continue;
        }
        else if (isNaN($scope.priceSystems[i].psPrice)) {
          layer.msg('价格体系必须为数字.', {offset: 0, shift: 6}); return false;
        }
      }
      //if(!($scope.modalData.image && $scope.modalData.image.url)  || $scope.modalData.image.url == "") {layer.msg('请上传图片.', {offset: 0, shift: 6}); return false;}
      if(($scope.modalData.image && $scope.modalData.image.url)  || $scope.modalData.image.url !== "") {
        $scope.modalData.imageUrl = $scope.modalData.image.url;
        delete $scope.modalData.image;
      }
      angular.extend($scope.modalData, {priceSystems: $scope.priceSystems});
      return true;
    }



  })

/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddProductionTaskCtrl', function ($scope, $filter, tailoringTypes, factoryService, commonService, ngDialog, toaster, specification_clothing_type) {
    $scope.item = {};

    $scope.getTailoringTypes = function(search) {
      var newTailoringTypes = $scope.tailoringTypes.slice();
      if (search && newTailoringTypes.indexOf(search) === -1) {
        newTailoringTypes.unshift(search);
      }
      return newTailoringTypes;
    };

    $scope.TailoringTypes = tailoringTypes;

    $scope.tailoringTypes = [
      '西服套装A',
      '裤子B',
      '马甲C',
      '大衣E',
      '衬衫D',
      '礼服G',
      '夹克F'
    ];

    $scope.isFirstHalfs = [{shortName: true, fullName: '上半月'}, {shortName: false, fullName: '下半月'}];

    $scope.addTask = function (item) {
      console.log(item)
      if ($scope.validate()) {
        if ($scope.tailoringTypes.indexOf(item.tailoringType) === -1) {
          item.clothingTypes = 'OTHER';
          item.otherClothes = item.tailoringType;
        }
        else {
          $.each(specification_clothing_type, function (k, v) {
            if (item.tailoringType == v) {
              item.clothingTypes = k;
            }
          })
        }
        delete item.tailoringType;
        
        var dateNow = new Date();
        var month = dateNow.getMonth();
        var year = dateNow.getFullYear();
        var daysInOneMonth = commonService.getDaysInOneMonth(year, parseInt(month) + 1);
        $scope.daysList = [];
        if (item.isFirstHalf == 'true') {
          for (var i=1; i<=15; i++) {
            $scope.daysList.push(parseInt(month) + 1 + '月' + i + '日');
          }
        }
        if (item.isFirstHalf == 'false') {
          for (var i=15; i<=daysInOneMonth; i++) {
            $scope.daysList.push(parseInt(month) + 1 + '月' + i + '日');
          }
        }
        console.log($scope.daysList);
        ngDialog.openConfirm({
          template: 'views/factory/otherManage/modal/addProductionTask.html',
          className: 'ngdialog-theme-default dialogcaseeditor',
          controller: 'AddProductionTaskModalCtrl',
          data: {daysList: $scope.daysList, item: item}
        }).then(
          function (value) {
            console.log(value);
            var postData = {};
            postData.clothingType = item.clothingTypes;
            postData.isFirstHalf = item.isFirstHalf;
            postData.month = $filter('date')(dateNow, 'yyyyMM');
            postData.taskNum = [];
            angular.forEach(value, function (day) {
              postData.taskNum.push(day.count);
            });
            console.log(postData)
            factoryService.addTask(postData).then(function (data) {
              if (data && data.success == true) {
                toaster.pop('success', '设置生产任务成功！');
                $scope.item = {};
              }
              else if (data && data.success == false) {
                toaster.pop('error', data.error.message);
              }
            })
          }
        )
      }

    };





    $scope.validate = function () {
      if(!$scope.item.tailoringType) {layer.tips('请选择定制项目', '#_clothing'); scrollTo('#_clothing'); return false;}
      if(!$scope.item.isFirstHalf) {layer.tips('请选择上/下半月', '#_isFirstHalf'); scrollTo('#_isFirstHalf'); return false;}
      return true;
    };
    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

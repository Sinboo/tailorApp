/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('EditProductionTaskCtrl', function ($scope, toaster, $filter, ngDialog, factoryService, commonService) {
    var dateNow = new Date();

    var initData = function() {
      $scope.tasks = [];
      factoryService.getTask().then(function (data) {
        if (data && data.success == true) {
          angular.forEach(data.data, function (item) {
            if (parseInt(item.month) == parseInt($filter('date')(dateNow, 'yyyyMM'))) {
              if (item.isFirstHalf == true) {
                if (parseInt($filter('date')(dateNow, 'DD')) < 15) {
                  $scope.tasks.push(item)
                }
              }
              if (item.isFirstHalf == false) {
                $scope.tasks.push(item)
              }
            }
            if (parseInt(item.month) > parseInt($filter('date')(dateNow, 'yyyyMM'))) {
              $scope.tasks.push(item)
            }
          });
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      });
    };
    initData();


    $scope.editRow = function (item) {
      var month = item.month.toString().slice(-2);
      var year = item.month.toString().substring(0,4);
      var daysInOneMonth = commonService.getDaysInOneMonth(year, month);
      $scope.daysList = [];
      if (item.isFirstHalf == true) {
        for (var i=1; i<=15; i++) {
          $scope.daysList.push(month + '月' + i + '日');
        }
      }
      if (item.isFirstHalf == false) {
        for (var i=15; i<=daysInOneMonth; i++) {
          $scope.daysList.push(month + '月' + i + '日');
        }
      }
      console.log($scope.daysList);
      ngDialog.openConfirm({
        template: 'views/factory/otherManage/modal/addProductionTask.html',
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'AddProductionTaskModalCtrl',
        data: {daysList: $scope.daysList, item: item, editFlag: true}
      }).then(
        function (value) {
          console.log(value);
          var postData = {};
          postData.taskNum = [];
          angular.forEach(value, function (day) {
            postData.taskNum.push(day.count);
          });
          console.log(postData);
          factoryService.editTask(postData, item.number).then(function (data) {
            if (data && data.success == true) {
              toaster.pop('success', '修改生产任务成功！');
              initData();
            }
            else if (data && data.success == false) {
              toaster.pop('error', data.error.message);
            }
          })
        }
      )
    };







    $scope.validate = function () {
      if(!$scope.item.gender) {layer.tips('请选择类别', '#_gender'); scrollTo('#_gender'); return false;}
      if(!$scope.item.clothing) {layer.tips('请选择类型', '#_clothing'); scrollTo('#_clothing'); return false;}
      if(!$scope.item.name) {layer.tips('请输入规格单名称', '#_specificationName'); scrollTo('#_specificationName'); return false;}
      if($scope.item.sizes.length == 0) {layer.tips('请新增至少一个号型', '#_setSize'); scrollTo('#_setSize'); return false;}
      return true;
    };
    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};


  })

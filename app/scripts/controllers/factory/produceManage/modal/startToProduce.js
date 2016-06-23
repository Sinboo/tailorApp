/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('StartToProduceModalCtrl', function ($scope, factoryService, ngDialog) {
    $scope.formData = {};
    var clothNum = $scope.ngDialogData.order.orderItem.quantity;
    console.log(clothNum)
    // angular.forEach($scope.ngDialogData.order.orderItem)
    var dateList = [];
    var queryParams = {};
    queryParams.clothingType = $scope.ngDialogData.order.orderItem.clothingTypes.length > 1 ? 'A' : $scope.ngDialogData.order.orderItem.clothingTypes[0];
    factoryService.scheduleFree(queryParams).then(function (data) {
      if (data && data.success == true) {
        $.each(data.data, function (k, v) {
          angular.forEach(v, function (value, key) {
            if (value > 0) {
              var item = {};
              item.date = k;
              var day = (key + 1) < 10 ? '0' + (key + 1) : (key + 1);
              item.date = item.date.toString() + day;
              item.number = value;
              dateList.push(item);
            }
          })
        })
        console.log(dateList);
        var addedNum = 0;
        for (var i=0; i < dateList.length; i++) {
          addedNum = addedNum + dateList[i].number;
          if (addedNum >= clothNum) {
            $scope.systemDate = dateList[i].date;
            break;
          }
        }
        console.log($scope.systemDate)
      }
      else if (data && data.error) {
        toaster.pop('warning', data.error.message);
      }
    });

    factoryService.produceFee($scope.ngDialogData.order.number).then(function (data) {
      if (data && data.success == true) {
        $scope.systemProduceFee = data.data == null ? '未设置' : data.data;
      }
      else if (data && data.error) {
        toaster.pop('warning', data.error.message);
      }
    });

    $scope.updateDate = function () {
      ngDialog.openConfirm({
        template: "views/factory/produceManage/modal/updateProduceDate.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'UpdateProduceDateModalCtrl',
        data: {clothNum: clothNum, dateList: dateList}
      }).then(function (value) {
        console.log(value)

        if (value) {
          $scope.formData.produceDays = [];
          $scope.formData.produceNum = [];
          angular.forEach(value, function (item) {
            if (item.count > 0) {
              $scope.formData.produceDays.push(item.date);
              $scope.formData.produceNum.push(item.count);
            }
          });
          var num = 0;
          for (var i=0; i<value.length; i++) {
            var cnt = value[i].count == undefined ? 0 : value[i].count;
            num = num + cnt;
            if (num == clothNum) {
              $scope.updatedDeliverDay = value[i].date;
              $scope.systemDate = value[i].date;
              console.log($scope.updatedDeliverDay, $scope.systemDate);
              break;
            }
          }
        }
      })
    };

    $scope.updateFee = function () {
      ngDialog.openConfirm({
        template: "views/factory/produceManage/modal/inputModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor',
        controller: 'InputModalCtrl'
      }).then(function (value) {
        if (value) {
          $scope.formData.fee = value;
          $scope.systemProduceFee = value;
        }
        else {
          $scope.formData.fee = $scope.systemProduceFee;
        }
      })
    };

    $scope.validate = function () {
      if ($scope.updatedDeliverDay) {
        $scope.formData.deliverDay = $scope.updatedDeliverDay;
      }
      else {
        $scope.formData.deliverDay = $scope.systemDate;
      }

      $scope.formData.remark = $scope.remark;


      return true;
    }


  });

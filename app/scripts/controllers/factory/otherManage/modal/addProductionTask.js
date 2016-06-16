/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('AddProductionTaskModalCtrl', function ($scope, tailoringTypes) {
    $scope.daysList = [];
    if ($scope.ngDialogData.editFlag ==  true) {
      var ii = 0;
      angular.forEach($scope.ngDialogData.daysList, function (item) {
        var day = {};
        day.count = $scope.ngDialogData.item.taskNum[ii];
        day.day = item;
        $scope.daysList.push(day);
        ii++;
      });
    }
    else {
      angular.forEach($scope.ngDialogData.daysList, function (item) {
        var day = {};
        day.count = 0;
        day.day = item;
        $scope.daysList.push(day);
      });
    }

    $scope.item = $scope.ngDialogData.item;
    if ($scope.item.clothingTypes) {
      $scope.item.tailoringType = $scope.item.clothingTypes=='OTHER'?$scope.item.otherClothes:tailoringTypes[$scope.item.clothingTypes.toString()];
    }

    $scope.ClothingTypes = {
      'A': '西服套装A',
      'B': '裤子B',
      'C': '马甲C',
      'E': '大衣E',
      'D': '衬衫D',
      'G': '礼服G',
      'F': '夹克F'
    };

    

    $scope.validate = function () {
      return true;
    }


  });

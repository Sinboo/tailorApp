/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('AccessoriesCtrl', function ($scope, $rootScope, dataSetterGetter, $location, providerService, $stateParams, PAGE_SIZE, ACCESSORY_TYPE) {
    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
      if (newLocation.indexOf('accessoryDetail') && oldLocation.indexOf('accessories')) {
        dataSetterGetter.set('accessoryPage', param.page);
      }
      if (newLocation.indexOf('accessories') && oldLocation.indexOf('accessoryDetail')) {
        param.page = dataSetterGetter.get('accessoryPage') ? dataSetterGetter.get('accessoryPage') : 0;
      }
    });

    $scope.ACCESSORY_TYPE = ACCESSORY_TYPE;
    $scope.type = $stateParams.business;
    
    var param = {};
    param.page = dataSetterGetter.get('accessoryPage') ? dataSetterGetter.get('accessoryPage') : 0;
    param.business = $stateParams.business == "" ? undefined : $stateParams.business;
    param.pageSize = PAGE_SIZE;

    var queryParams = JSON.parse(JSON.stringify(param));
    providerService.getAllAccessories(queryParams).then(function(data){
      initData(queryParams, data.data)
    });


    var initData = function (param, data) {
      $scope.accessories = data.content;
      $scope.total = data.totalElements;

      $scope.bigTotalItems = data.totalElements;
      $scope.maxSize = 10;
      $scope.perPages = 20;
      $scope.bigCurrentPage = param.page + 1 || 1;
    };

    $scope.changeFn = function (key, value) {
      if (key === 'page') {
        param[key] = $scope.bigCurrentPage - 1;
      } else {
        param[key] = value == "" ? undefined : value;
      }
      var queryParams = JSON.parse(JSON.stringify(param))
      providerService.getAllAccessories(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };


  })

/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FactoriesCtrl', function ($scope, $rootScope, dataSetterGetter, $location, providerService, $stateParams, PAGE_SIZE) {
    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
      if (newLocation.indexOf('factoryDetail') && oldLocation.indexOf('factories')) {
        dataSetterGetter.set('factoryPage', param.page);
      }
      if (newLocation.indexOf('factories') && oldLocation.indexOf('factoryDetail')) {
        param.page = dataSetterGetter.get('factoryPage') ? dataSetterGetter.get('factoryPage') : 0;
      }
    });

    var param = {};
    param.page = dataSetterGetter.get('factoryPage') ? dataSetterGetter.get('factoryPage') : 0;
    param.business = $stateParams.business == "" ? undefined : $stateParams.business;
    param.pageSize = PAGE_SIZE;

    var queryParams = JSON.parse(JSON.stringify(param));
    providerService.getAllFactories(queryParams).then(function(data){
      initData(queryParams, data.data)
    });


    var initData = function (param, data) {
      $scope.factories = data.content;
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
      providerService.getAllFactories(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };


  })

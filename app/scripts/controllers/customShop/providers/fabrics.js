/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FabricsCtrl', function ($scope, $rootScope, dataSetterGetter, $location, providerService, $stateParams, PAGE_SIZE) {
    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
      //console.log('new:' + newLocation);
      //console.log('old:' + oldLocation);
      if (newLocation.indexOf('fabricDetail') && oldLocation.indexOf('fabrics')) {
        dataSetterGetter.set('page', param.page);
      }
      if (newLocation.indexOf('fabrics') && oldLocation.indexOf('fabricDetail')) {
        param.page = dataSetterGetter.get('page') ? dataSetterGetter.get('page') : 0;
      }
    });

    var param = {};
    param.page = dataSetterGetter.get('page') ? dataSetterGetter.get('page') : 0;
    param.business = $stateParams.business == "" ? undefined : $stateParams.business;
    param.pageSize = PAGE_SIZE;

    var queryParams = JSON.parse(JSON.stringify(param));
    providerService.getAllFabrics(queryParams).then(function(data){
      initData(queryParams, data.data)
    });


    var initData = function (param, data) {
      $scope.fabrics = data.content;
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
      providerService.getAllFabrics(queryParams).then(function(data){
        initData(queryParams, data.data)
      });
    };


  })

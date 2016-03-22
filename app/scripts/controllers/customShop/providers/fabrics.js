/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('FabricsCtrl', function ($scope, providerService, $stateParams, PAGE_SIZE) {

    var param = {};
    param.page = 0;
    param.business = $stateParams.business == "" ? undefined : $stateParams.business;
    param.pageSize = PAGE_SIZE;

    var queryParams = JSON.parse(JSON.stringify(param))
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

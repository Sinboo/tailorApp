/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ShopManageNavCtrl', function ($scope, $location, localStorageService) {

    $scope.privilege = localStorageService.cookie.get('user').privilege;
    $scope.admin = localStorageService.cookie.get('user').admin;
    
    $scope.$on('to-shopManageNav', function(e, d) {
      if ($location.path().indexOf('INIT') !== -1 || $location.path().indexOf('OUT') !== -1) {
        $scope.unNotiHighLight = '';
        $scope.notiHighLight = '';
      }
      else {
        $scope.unNotiHighLight = d == 'false' ? 'am-text-primary' : '';
        $scope.notiHighLight = d == 'true' ? 'am-text-primary' : '';
      }
    });

    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };


  })

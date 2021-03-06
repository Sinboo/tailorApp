/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('MoreManageNavCtrl', function ($scope, $location, localStorageService) {

    $scope.privilege = localStorageService.cookie.get('user').privilege;
    $scope.admin = localStorageService.cookie.get('user').admin;
    
    $scope.providerCurrency = localStorageService.cookie.get('user').currency;

    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  })

/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('OtherManageNavCtrl', function ($scope, $location, $state, localStorageService) {

    $scope.privilege = localStorageService.cookie.get('user').privilege;
    $scope.admin = localStorageService.cookie.get('user').admin;

    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

    $scope.go = function (type) {
      $scope.addressType = undefined;
      $state.go('tailor.otherManage.positionManage', {type: type, addressType: undefined})
    }

    $scope.choose = function (type) {
      $scope.addressType = type;
      $state.go('tailor.otherManage.positionManage', {type: 'address', addressType: type});
    }

  })

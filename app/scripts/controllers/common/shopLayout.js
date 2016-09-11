/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ShopLayoutCtrl', function ($scope, $location, $state, localStorageService, ngDialog) {

    $scope.allProviderClicked = function () {
      $state.go('tailor.providers.fabrics', {}, {inherit: false});
      $scope.$broadcast('to-providers-nav', false);
    };

    $scope.shortName = localStorageService.cookie.get('user').shortName == undefined ? '测试用户' : localStorageService.cookie.get('user').shortName;

    $scope.privilege = localStorageService.cookie.get('user').privilege;
    $scope.admin = localStorageService.cookie.get('user').admin;
    
    $scope.getLayoutClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-active' : '';
    };

    $scope.login = function () {
      //$state.go('login', {}, {reload: true});
      $state.go("tailor.shopManage.orderRecord", {STATUS: 'DOING'});
    }

    $scope.logout = function () {
      localStorageService.cookie.set('user', {anonymous: true});
      $state.go('login', {}, {reload: true});
    }

    $scope.aboutUs = function () {
      ngDialog.open({
        template: 'views/common/aboutUs.html',
        className: 'ngdialog-theme-default dialogcaseeditor'
      })
    }

    $scope.howToJoin = function () {
      ngDialog.open({
        template: 'views/common/howToJoin.html',
        className: 'ngdialog-theme-default dialogcaseeditor'
      })
    }

    $scope.law = function () {
      ngDialog.open({
        template: 'views/common/law.html',
        className: 'ngdialog-theme-default dialogcaseeditor'
      })
    }

  })

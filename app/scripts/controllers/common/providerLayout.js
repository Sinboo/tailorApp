/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProviderLayoutCtrl', function ($scope, $state, $location, localStorageService, ngDialog) {

    $scope.customShopClicked = function () {
      $state.go('provider.customShop.myCustomShops', {}, {inherit: false});
      $scope.$broadcast('to-customShop-nav', false);
    };

    $scope.shortName = localStorageService.cookie.get('user').shortName == undefined ? '测试用户' : localStorageService.cookie.get('user').shortName;
    $scope.privilege = localStorageService.cookie.get('user').privilege;
    $scope.admin = localStorageService.cookie.get('user').admin;

    $scope.getLayoutClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-active' : '';
    };

    $scope.login = function () {
      //$state.go('login', {}, {reload: true});
      $state.go("provider.orderManage.myOrderManage", {STATUS: 'PAYED'});
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

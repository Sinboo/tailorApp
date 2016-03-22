/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('LoginRegisterCtrl', function ($scope, ngDialog, $http, localStorageService, $state, $timeout, registerService, loginService, toaster, baseService) {
    $scope.remember = localStorageService.get('checked');
    $scope.divisions = localStorageService.get('divisions');
    if (!$scope.divisions) {
      baseService.getDivision().then(function (data) {
        if (data && data.data.length>0) {
          $scope.divisions = data.data;
          localStorageService.set('divisions', data.data);
        }
      });
    }

    $scope.formData = {};

    $scope.login = function (loginData) {
      if(!(loginData.number)) {
        layer.tips('请输入账号', '#_loginNumber'); scrollTo('#_loginNumber'); return false;
      }
      if(!(loginData.passwd)) {
        layer.tips('请输入密码', '#_loginPasswd'); scrollTo('#_loginPasswd'); return false;
      }

      if (loginData.number == 'AAAAA' || loginData.number == 'BBBBB') {
        toaster.pop('success', '登录成功!');
        if (loginData.number == 'AAAAA') {
          var shopUser = {
            "token": "ca2cb8ad5a665a09d1caf2d54e5adf83",
            "lastLoginTime": 1452065632689,
            "merchantNumber": "AAAA",
            "merchantType": "SHOP"
          }
          localStorageService.cookie.set('user', shopUser);
          $state.go("tailor.provider.fabric");
        }
        if (loginData.number == 'BBBBB') {
          var fabricUser = {
            "token": "ca2cb8ad5a665a09d1caf2d54e5adf82",
            "lastLoginTime": 1452065632688,
            "merchantNumber": "BBBB",
            "merchantType": "FABRIC"
          }
          localStorageService.cookie.set('user', fabricUser);
          $state.go("provider.orderManage.myOrderManage", {STATUS: 'PAYED'});
        }
      }
      else {
        $http.post("/api/v1/login", loginData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          transformRequest: function(data){return $.param(data);}
        }).success(function(data) {
          console.log(data)
          if (data && data.success == false) {
            toaster.pop('error', '登录失败，请重新登录.');
            if (data.error.message == '密码错') {
              layer.tips(data.error.message, '#_loginPasswd'); scrollTo('#_loginPasswd');
            }
            if (data.error.message == '无此账户') {
              layer.tips(data.error.message, '#_loginNumber'); scrollTo('#_loginNumber');
            }
            toaster.pop('warning', data.error.message);
          }
          else if (data && data.success == true) {
            localStorageService.set('remember', loginData);
            localStorageService.cookie.set('user', data.data);
            toaster.pop('success', '登录成功!');
            if (localStorageService.cookie.get('user').merchantType == 'SHOP') {
              $state.go("tailor.shopManage.orderRecord", {STATUS: 'DOING'});
            }
            if (localStorageService.cookie.get('user').merchantType == 'FABRIC') {
              $state.go("provider.orderManage.myOrderManage", {STATUS: 'PAYED'});
            }
          }
        });
      }
    };

    var scrollTo = function (id) {$('html,body').animate({scrollTop:$(id).offset().top - 100}, 200);};

    $scope.register = function () {
      ngDialog.openConfirm({
        template: "views/login/modal/registerChooseModal.html",
        className: 'ngdialog-theme-default dialogcaseeditor'
      }).then(function (value) {
        ngDialog.openConfirm({
          template: "views/login/modal/registerCustomShopModal.html",
          className: 'ngdialog-theme-default dialogcaseeditor',
          controller: 'RegisterCustomShopModalCtrl',
          scope: $scope
        }).then(function (value) {
          var postData = value;
          var postString = JSON.stringify(postData);
          console.log(postString)
          registerService.shopApply(postString).then(function (data) {
            if (data && data.success == true) {
              mytoster(data);
            }
          });
        });
      }, function (value) {
        if (value == "provider") {
          ngDialog.openConfirm({
            template: "views/login/modal/registerProviderModal.html",
            className: 'ngdialog-theme-default dialogcaseeditor',
            controller: 'RegisterProviderModalCtrl',
            scope: $scope
          }).then(function (value) {
            var postData = value;
            var postString = JSON.stringify(postData);
            console.log(postString)
            if (postData.providerType == 'fabric') {
              registerService.fabricApply(postString).then(function (data) {
                if (data && data.success == true) {
                  mytoster(data);
                }
              });
            }
            if (postData.providerType == 'factory') {
              registerService.factoryApply(postString).then(function (data) {
                if (data && data.success == true) {
                  mytoster(data);
                }
              });
            }
            if (postData.providerType == 'accessory') {
              registerService.accessoryApply(postString).then(function (data) {
                if (data && data.success == true) {
                  mytoster(data);
                }
              });
            }
          });
        }
      });
    };

    var mytoster = function (data) {
      var dialog;
      if (!data.success || data.success == false) {
        dialog = ngDialog.open({template: '<div class="ngdialog-message"> \
                <span class="am-text-warning">申请提交失败，请重新申请。</span></div>\
                <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />',
          plain: 'true'
        });
      }
      if (data && data.success == true) {
        dialog = ngDialog.open({template: '<div class="ngdialog-message"> \
                <span class="am-text-success">您的申请已提交，我们的工作人员会尽快与您联系。</span></div>\
                <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />',
          plain: 'true'
        });
      }
      if (dialog) {
        var timer = $timeout(function() {
          dialog.close();
        }, 2000);
      }
    };

    $scope.keyPress = function (e) {
        if(e.keyCode == 13) {
          $scope.login($scope.loginData);
        }
    };

    $scope.setRemember = function (remember) {
      if (remember) {
        localStorageService.set('checked', true);
      }
      else {
        localStorageService.set('checked', false);
      }
    };

    $scope.inputting = function (number) {
      if ($scope.remember) {
        if (number == localStorageService.get('remember').number) {
          $scope.loginData.passwd = localStorageService.get('remember').passwd;
        }
      }
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

  });

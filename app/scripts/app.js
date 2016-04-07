'use strict';

/**
 * @ngdoc overview
 * @name mobileAppApp
 * @description
 * # mobileAppApp
 *
 * Main module of the application.
 */
angular.module('gitdao', []);
angular
  .module('tailorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'toaster',
    'angular-loading-bar',
    'ngDialog',
    'ngRap',
    'checklist-model',
    'bootstrapLightbox',
    'Firestitch.angular-counter',
    'upyun',
    'uuid',
    'Big',
    'ui.date',
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'LocalStorageModule',
    'ngTouch',
    'gitdao'
  ])
  .config(function($animateProvider) {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
  })
  .config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }])
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('tailorApp');
  })
  .config(['upyunProvider',function(upyunProvider) {
    upyunProvider.config({
      form_api_secret: 'ZeJhPE68fuX7jRkPMeFXOOyBl40=',
      bucket: 'imtailor'
    });
  }])
  //.config(['$httpProvider', 'ngRapProvider', function(httpProvider, ngRapProvider) {
  //  ngRapProvider.script = 'http://112.126.70.25:8040/rap.plugin.js?projectId=4'; // replce your host and project id
  //  ngRapProvider.enable({
  //    mode: 3
  //  });
  //  httpProvider.interceptors.push('rapMockInterceptor');
  //}])
  .config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  })
  .config(function ($locationProvider, $urlRouterProvider, $stateProvider, $httpProvider) {

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');
    $urlRouterProvider
      .when('/', '/login')
      .when('', '/login')
      .otherwise('/err');

    $httpProvider.interceptors.push('myHttpInterceptor');
    $httpProvider.interceptors.push('myHttpHeader');
  })
  .config(function ($stateProvider) {
    $stateProvider
      .state('blank', {
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('factory', {
        url: '/3',
        templateUrl: '/views/common/factoryLayout.html',
        controller: 'FactoryLayoutCtrl',
        resolve: {
          security:function($q, localStorageService) {
            if(localStorageService.cookie.get('user').merchantType !== 'FACTORY'){
              return $q.reject("Not Authorized");
            }
          }
        }
      })
      .state('factory.customShop', {
        url: '^/3/customShop',
        templateUrl: '/views/factory/customShop/nav.html',
        controller: 'FactoryCustomShopNavCtrl'
      })
      .state('factory.customShop.cooperationApplication', {
        url: '/cooperationApplication',
        templateUrl: '/views/factory/customShop/cooperationApplication.html',
        controller: 'FactoryCooperationApplicationCtrl'
      })
      .state('factory.customShop.cooperationApplicationDetail', {
        url: '/cooperationApplicationDetail',
        templateUrl: '/views/factory/customShop/cooperationApplicationDetail.html',
        controller: 'FactoryCooperationApplicationDetailCtrl',
        params: {apply: null}
      })

      .state('factory.otherManage', {
        url: '^/3/otherManage',
        templateUrl: '/views/factory/otherManage/nav.html',
        controller: 'FactoryOtherManageNavCtrl'
      })
      .state('factory.otherManage.fixPWD', {
        url: '/fixPWD',
        templateUrl: '/views/factory/otherManage/changePassword.html',
        controller: 'FactoryFixPWDCtrl'
      })
      .state('factory.otherManage.addSubAccount', {
        url: '/addSubAccount',
        templateUrl: '/views/factory/otherManage/addSubAccount.html',
        controller: 'AddSubAccountCtrl'
      })
      .state('factory.otherManage.modifySubAccount', {
        url: '/modifySubAccount',
        templateUrl: '/views/factory/otherManage/modifySubAccount.html',
        controller: 'ModifySubAccountCtrl'
      })

      .state('factory.fabricReceiveManage', {
        url: '^/3/fabricReceiveManage',
        templateUrl: '/views/factory/fabricReceiveManage/nav.html',
        controller: 'FabricReceiveManageNavCtrl'
      })
      .state('factory.fabricReceiveManage.fabricReceiveManage', {
        url: '/fabricReceiveManage/:STATUS',
        templateUrl: '/views/factory/fabricReceiveManage/fabricReceiveManage.html',
        controller: 'FabricReceiveManageCtrl'
      })

      .state('factory.produceManage', {
        url: '^/3/produceManage',
        templateUrl: '/views/factory/produceManage/nav.html',
        controller: 'ProduceManageNavCtrl'
      })



      .state('provider', {
        url: '/2',
        templateUrl: '/views/common/providerLayout.html',
        controller: 'ProviderLayoutCtrl',
        resolve: {
          security:function($q, localStorageService) {
            if(localStorageService.cookie.get('user').merchantType !== 'FABRIC'){
              return $q.reject("Not Authorized");
            }
          }
        }
      })
      .state('provider.customShop', {
        url: '^/2/customShop',
        templateUrl: '/views/provider/customShop/nav.html',
        controller: 'CustomShopNavCtrl'
      })
      .state('provider.customShop.myCustomShops', {
        url: '/myCustomShops/:business',
        templateUrl: '/views/provider/customShop/myCustomShops.html',
        controller: 'MyCustomShopsCtrl',
        resolve: {
          newApplyCount: function (providerService) {
            return providerService.newApplyCount();
          }
        }
      })
      .state('provider.customShop.cooperationApplication', {
        url: '/cooperationApplication',
        templateUrl: '/views/provider/customShop/cooperationApplication.html',
        controller: 'CooperationApplicationCtrl'
      })
      .state('provider.customShop.cooperationApplicationDetail', {
        url: '/cooperationApplicationDetail',
        templateUrl: '/views/provider/customShop/cooperationApplicationDetail.html',
        controller: 'CooperationApplicationDetailCtrl',
        params: {apply: null}
      })
      .state('provider.customShop.monthlyStatement', {
        url: '/monthlyStatement/:billType',
        templateUrl: '/views/provider/customShop/monthlyStatement.html',
        controller: 'MonthlyStatementCtrl'
      })

      .state('provider.orderManage', {
        url: '^/2/orderManage',
        templateUrl: '/views/provider/orderManage/nav.html',
        controller: 'OrderManageNavCtrl'
      })
      .state('provider.orderManage.myOrderManage', {
        url: '/myOrderManage/:STATUS',
        templateUrl: '/views/provider/orderManage/myOrderManage.html',
        controller: 'MyOrderManageCtrl'
      })
      .state('provider.orderManage.orderDetail', {
        url: '/orderDetail',
        templateUrl: '/views/provider/orderManage/orderDetail.html',
        controller: 'OrderDetailCtrl',
        params: {order: null}
      })


      .state('provider.businessManage', {
        url: '^/2/businessManage',
        templateUrl: '/views/provider/businessManage/nav.html',
        controller: 'BusinessManageNavCtrl'
      })
      .state('provider.businessManage.addProduct', {
        url: '/addProduct',
        templateUrl: '/views/provider/businessManage/addProduct.html',
        controller: 'AddProductCtrl'
      })
      .state('provider.businessManage.repertoryAndPrice', {
        url: '/repertoryAndPrice',
        templateUrl: '/views/provider/businessManage/repertoryAndPrice.html',
        controller: 'RepertoryAndPriceCtrl'
      })
      .state('provider.businessManage.stockManage', {
        url: '/stockManage',
        templateUrl: '/views/provider/businessManage/stockManage.html',
        controller: 'StockManageCtrl'
      })
      .state('provider.businessManage.outStockManage', {
        url: '/outStockManage',
        templateUrl: '/views/provider/businessManage/outStockManage.html',
        controller: 'OutStockManageCtrl'
      })
      .state('provider.businessManage.modifyRepertory', {
        url: '/modifyRepertory',
        templateUrl: '/views/provider/businessManage/modifyRepertory.html',
        controller: 'ModifyRepertoryCtrl'
      })

      .state('provider.moreManage', {
        url: '^/2/moreManage',
        templateUrl: '/views/provider/moreManage/nav.html',
        controller: 'MoreManageNavCtrl'
      })
      .state('provider.moreManage.fixPWD', {
        url: '/fixPWD',
        templateUrl: '/views/provider/moreManage/changePassword.html',
        controller: 'FixPWDCtrl'
      })
      .state('provider.moreManage.fixExchangeRate', {
        url: '/fixExchangeRate',
        templateUrl: '/views/provider/moreManage/fixExchangeRate.html',
        controller: 'FixExchangeRateCtrl'
      })
      .state('provider.moreManage.changeContact', {
        url: '/changeContact',
        templateUrl: '/views/provider/moreManage/changeContact.html',
        controller: 'ChangeContactCtrl'
      })


      .state('tailor', {
        url: '/1',
        templateUrl: '/views/common/shopLayout.html',
        controller: 'ShopLayoutCtrl',
        resolve: {
          security:function($q, localStorageService) {
            if(localStorageService.cookie.get('user').merchantType !== 'SHOP'){
              return $q.reject("Not Authorized");
            }
          }
        }
      })
      .state('tailor.otherManage', {
        url: '^/1/otherManage',
        templateUrl: '/views/customShop/otherManage/nav.html',
        controller: 'OtherManageNavCtrl'
      })
      .state('tailor.otherManage.positionManage', {
        url: '/positionManage/:type?addressType',
        templateUrl: '/views/customShop/otherManage/positionManage.html',
        controller: 'PositionManageCtrl'
      })
      .state('tailor.otherManage.addPosition', {
        url: '/addPosition',
        templateUrl: '/views/customShop/otherManage/addPosition.html',
        controller: 'AddPositionCtrl'
      })
      .state('tailor.otherManage.changePassword', {
        url: '/changePassword',
        templateUrl: '/views/customShop/otherManage/changePassword.html',
        controller: 'ChangePasswordCtrl'
      })


      .state('tailor.shopManage', {
        url: '^/1/shopManage',
        templateUrl: '/views/customShop/shopManage/nav.html',
        controller: 'ShopManageNavCtrl'
      })
      .state('tailor.shopManage.orderRecord', {
        url: '/orderRecord/:STATUS',
        templateUrl: '/views/customShop/shopManage/orderRecord.html',
        controller: 'OrderRecordCtrl'
      })
      .state('tailor.shopManage.addOrderRecord', {
        url: '/addOrderRecord',
        templateUrl: '/views/customShop/shopManage/addOrderRecord.html',
        controller: 'AddOrderRecordCtrl'
      })
      .state('tailor.shopManage.fabricManage', {
        url: '/fabricManage/:clothingType',
        templateUrl: '/views/customShop/shopManage/fabricManage.html',
        controller: 'FabricManageCtrl'
      })
      .state('tailor.shopManage.orderManage', {
        url: '/orderManage/:STATUS',
        templateUrl: '/views/customShop/shopManage/orderManage.html',
        controller: 'OrderManageCtrl'
      })
      .state('tailor.shopManage.buyFabric', {
        url: '/buyFabric/:supplierName?supplierNumber?factoryName?clothingType?factoryNum?expressFeeStatus?remark?orderNumber?expressFee?fabricFee?totalPrice4CNY?totalPrice',
        templateUrl: '/views/customShop/shopManage/buyFabric.html',
        controller: 'BuyFabricCtrl',
        params: {orderList: null},
        resolve: {
          payment: function ($stateParams, customShopService) {
           return customShopService.payment($stateParams.supplierNumber);
          }
        }
      })
      .state('tailor.shopManage.boughtFabric', {
        url: '/boughtFabric',
        templateUrl: '/views/customShop/shopManage/boughtFabric.html',
        controller: 'BoughtFabricCtrl'
      })
      .state('tailor.shopManage.productionRecord', {
        url: '/productionRecord/:STATUS',
        templateUrl: '/views/customShop/shopManage/productionRecord.html',
        controller: 'ProductionRecordCtrl'
      })
      .state('tailor.shopManage.monthlyStatement', {
        url: '/monthlyStatement/:billType',
        templateUrl: '/views/customShop/shopManage/monthlyStatement.html',
        controller: 'ShopMonthlyStatementCtrl'
      })
      .state('tailor.shopManage.storageManage', {
        url: '/storageManage/:STATUS?notified',
        templateUrl: '/views/customShop/shopManage/storageManage.html',
        controller: 'StorageManageCtrl'
      })


      .state('tailor.repertory', {
        url: '^/1/repertory',
        templateUrl: '/views/customShop/repertory/nav.html',
        controller: 'RepertoryNavCtrl'
      })
      .state('tailor.repertory.quickQuery', {
        url: '/quickQuery/:fabricId?shortName',
        templateUrl: '/views/customShop/repertory/quickQuery.html',
        controller: 'QuickQueryCtrl'
      })
      .state('tailor.repertory.outOfStock', {
        url: '/outOfStock/:fabricId?shortName',
        templateUrl: '/views/customShop/repertory/outOfStock.html',
        controller: 'OutOfStockCtrl'
      })
      .state('tailor.repertory.canceled', {
        url: '/canceled/:fabricId?shortName',
        templateUrl: '/views/customShop/repertory/canceled.html',
        controller: 'CanceledCtrl'
      })

      .state('tailor.providers', {
        url: '^/1/allProviders',
        templateUrl: '/views/customShop/providers/nav.html',
        controller: 'ProvidersNavCtrl'
      })
      .state('tailor.providers.fabrics', {
        url: '/fabrics/:business',
        templateUrl: '/views/customShop/providers/fabrics.html',
        controller: 'FabricsCtrl'
      })
      .state('tailor.providers.fabricDetail', {
        url: '/fabricDetail/:id',
        templateUrl: '/views/customShop/providers/fabricDetail.html',
        controller: 'FabricDetailCtrl'
      })
      .state('tailor.providers.factories', {
        url: '/factories/:business',
        templateUrl: '/views/customShop/providers/factories.html',
        controller: 'FactoriesCtrl'
      })
      .state('tailor.providers.factoryDetail', {
        url: '/factoryDetail/:id',
        templateUrl: '/views/customShop/providers/factoryDetail.html',
        controller: 'FactoryDetailCtrl'
      })

      .state('tailor.provider', {
        url: '^/1/provider',
        templateUrl: '/views/customShop/provider/nav.html',
        controller: 'ProviderNavCtrl'
      })
      .state('tailor.provider.fabric', {
        url: '/fabric',
        templateUrl: '/views/customShop/provider/fabric.html',
        controller: 'FabricCtrl'
      })
      .state('tailor.provider.myApplicaiton', {
        url: '/myApplication/:status',
        templateUrl: '/views/customShop/provider/myApplication.html',
        controller: 'MyApplicationCtrl'
      })

      .state('error', {
        url: '^/err',
        templateUrl: '/views/error.html'
      })
      .state('notAuthorized', {
        url: '^/notAuthorized',
        templateUrl: '/views/notAuthorized.html'
      })

      .state('login', {
        url: '^/login',
        templateUrl: '/views/login/login.html',
        controller: 'LoginRegisterCtrl'
      });
  })
  .run(function ($rootScope, localStorageService, loginService, $location, $state) {


    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        //$activityIndicator.stopAnimating();
        layer.close($rootScope.ii);


      });

    $rootScope.$on('$stateChangeError',
      function (event, toState, toParams, fromState, fromParams, error) {
        if (error.state) {
          $state.go('error');
        }
        if(error == "Not Authorized"){
          $state.go("notAuthorized");
        }
      });

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {

        if(toState.name=='login') return;

        if (localStorageService.cookie.get('user') == undefined || localStorageService.cookie.get('user').anonymous) {
          event.preventDefault();
          $state.go("login",{from:fromState.name});
        }



        layer.close($rootScope.ii);
        $rootScope.ii = layer.load(2);
      });

    loginService.initUser()

  });

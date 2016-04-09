'use strict';

angular.module('tailorApp')
  .factory('factoryUrl', function (publicFunc) {
    var prefix = '/api/v1/';
    var url = {
      newApply_count: {
        url: 'factory/partner/apply/new/count',
        method: 'GET'
      },
      new_applies: {
        url: 'factory/partner/apply/new',
        method: 'GET'
      },
      unassigned_partners: {
        url: 'account/factory/opPartner',
        method: 'GET'
      },
      accept_apply: {
        url: 'factory/partner/apply/{id}/accept',
        method: 'PUT'
      },
      add_account: {
        url: 'account',
        method: 'POST'
      },
      get_accounts: {
        url: 'account',
        method: 'GET'
      },
      modify_accounts: {
        url: 'account/{ID}',
        method: 'PUT'
      },
      delete_account: {
        url: 'account/{ID}',
        method: 'DELETE'
      },
      fabrics: {
        url: 'factory/fabric/{STATUS}',
        method: 'GET'
      },
      receive_fabric: {
        url: 'factory/fabric/{ID}/receive',
        method: 'PUT'
      },
      add_specification: {
        url: 'factory/specification',
        method: 'POST'
      },
      get_specifications: {
        url: 'factory/specification',
        method: 'GET'
      }

    };
    return publicFunc.urlAddPrefix(url, prefix);
  })
  .service('factoryService', function (httpService, factoryUrl) {
    this.newApplyCount = function () {
      return httpService.http({}, factoryUrl.newApply_count, {})
    };
    this.newApplies = function () {
      return httpService.http({}, factoryUrl.new_applies, {})
    };
    this.unassignedPartners = function () {
      return httpService.http({}, factoryUrl.unassigned_partners, {})
    };
    this.acceptApply = function (queryParams) {
      return httpService.http({}, factoryUrl.accept_apply, queryParams)
    };
    this.addSubAccount = function (postData) {
      return httpService.http(postData, factoryUrl.add_account, {})
    };
    this.subAccounts = function () {
      return httpService.http({}, factoryUrl.get_accounts, {})
    };
    this.modifySubAccount = function (params, ID) {
      return httpService.http(params, factoryUrl.modify_accounts, {ID: ID})
    };
    this.deleteSubAccount = function (ID) {
      return httpService.http({}, factoryUrl.delete_account, {ID: ID})
    };
    this.fabrics = function (queryParams) {
      return httpService.http({}, factoryUrl.fabrics, queryParams)
    };
    this.receiveFabric = function (ID) {
      return httpService.http({}, factoryUrl.receive_fabric, {ID: ID})
    };
    this.addSpecification = function (postData) {
      return httpService.http(postData, factoryUrl.add_specification, {})
    };
    this.getSpecifications = function () {
      return httpService.http({}, factoryUrl.get_specifications, {})
    }





  });

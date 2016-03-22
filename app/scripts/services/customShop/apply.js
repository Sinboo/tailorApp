'use strict';

angular.module('tailorApp')
  .factory('applyProviderUrl', function (publicFunc) {
    var prefix = '/api/v1/apply/';
    var url = {
      partner: {
        url: 'partner',
        method: 'POST'
      }
    };
    return publicFunc.urlAddPrefix(url, prefix);
  })
  .service('applyProviderService', function (httpService, applyProviderUrl, $state, cache, $q) {
    this.applyProviderPartner = function (postData) {
      return httpService.http(postData, applyProviderUrl.partner, {})
    };

  });

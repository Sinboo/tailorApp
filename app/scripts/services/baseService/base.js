'use strict';

angular.module('tailorApp')
  .factory('baseUrl', function (publicFunc) {
    var prefix = '/api/v1/';
    var url = {
      division: {
        url: 'gdata/division',
        method: 'GET'
      }
    };
    return publicFunc.urlAddPrefix(url, prefix);
  })
  .service('baseService', function (httpService, baseUrl, $state, cache, $q) {
    this.getDivision = function () {
      return httpService.http({}, baseUrl.division, {})
    };

  });

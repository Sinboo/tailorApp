/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('MyApplicationCtrl', function ($scope, $stateParams,customShopService, APPLY_STATUS) {
    $scope.APPLY_STATUS = APPLY_STATUS;
    var queryParams = {};
    queryParams.status = $stateParams.status == "" ? undefined : $stateParams.status;
    queryParams = JSON.parse(JSON.stringify(queryParams));
    customShopService.getPartnerApply(queryParams).then(function (data) {
      if (data && data.success == true) {
        $scope.applies = data.data;
      }
    })
  })

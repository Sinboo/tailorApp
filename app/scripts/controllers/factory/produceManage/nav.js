/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProduceManageNavCtrl', function ($scope, $location, factoryService, toaster) {
    var status_list = ['PLACED', 'PRODUCE', 'DELIVERED', 'SUCCESS'];
    angular.forEach(status_list, function (status) {
      factoryService.getShops(status).then(function (data) {
        if (data && data.success == true) {
          $scope[status + '_shops'] = data.data;
        }
        else if (data && data.error) {
          toaster.pop('warning', data.error.message);
        }
      });
    });



    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  })

/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ProduceManageNavCtrl', function ($scope, $location, localStorageService) {


    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  })

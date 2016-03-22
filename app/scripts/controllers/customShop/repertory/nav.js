/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('RepertoryNavCtrl', function ($scope, $location) {

    $scope.$on('to-nav', function(e, d) {
      $scope.fabricId = d.fabricId;
      $scope.shortName = d.shortName;
    });

    $scope.getClass = function (path) {
      return $location.path().indexOf(path) !== -1  ? 'am-text-primary' : '';
    };

  })

/**
 * Created by wxb on 16/1/16.
 */
'use strict';

angular.module('tailorApp')
  .controller('ConfirmReceivedModalCtrl', function ($scope, FABRIC_UNIT, tailoringTypes) {
    $scope.FABRIC_UNIT = FABRIC_UNIT;
    $scope.tailoringTypes = tailoringTypes;

  });

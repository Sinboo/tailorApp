/**
 * Created by wxb on 15/12/29.
 */
'use strict';

angular.module('tailorApp')
  .controller('ViewSpecificationCtrl', function ($scope, factoryService, $http, $state, toaster, not_trousers_parts, trousers_parts, SPECIFICATION_GENDER, CUSTOMCLOTHING_TYPE) {
    $scope.not_trousers_parts = not_trousers_parts;
    $scope.trousers_parts = trousers_parts;
    $scope.SPECIFICATION_GENDER = SPECIFICATION_GENDER;
    $scope.CUSTOMCLOTHING_TYPE = CUSTOMCLOTHING_TYPE;

    factoryService.getSpecifications().then(function (data) {
      if (data && data.success == true) {
        $scope.specifications = data.data;
      }
      else if (data && data.success == false) {
        toaster.pop('error', data.error.message)
      }
    });

    $scope.chooseSpecification = function (specification) {
      console.log(specification)
      $scope.flag = true;
      $scope.specification = specification;
      $scope.specificationFlag = specification.clothing == 'JEANS';
      var oneSpecification = specification.standard[Object.keys(specification.standard)[0]];
      $scope.parts = Object.keys(oneSpecification);
      console.log(oneSpecification)
      console.log($scope.parts)

    }





  })

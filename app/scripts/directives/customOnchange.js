/**
 * Created by wxb on 16/1/20.
 */
"use strict";

angular.module('tailorApp')
  .directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    };
  });

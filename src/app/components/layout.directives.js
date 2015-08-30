(function(){

'use strict';

angular.module('imgurapp')


	.directive('layoutCenter', function(){
		return {
			restrict:'A',
			transclude:true,
			template:'<div class="layout-inner-wrapper" ng-transclude></div>'
		};
	});
})();
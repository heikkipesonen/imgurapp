'use strict';

angular.module('imgurapp')

	.directive('directionIndicator', function(){
		return {
			restrict:'A',
			scope:{},
			template:
			'<div class="indicator-container indicator-vertical">'+
				'<div class="direction-indicator indicator-up"></div>'+
				'<div class="direction-indicator indicator-middle"></div>'+
				'<div class="direction-indicator indicator-down"></div>'+
			'</div>'+
			'<div class="indicator-container indicator-horizontal">'+
				'<div class="direction-indicator indicator-left"></div>'+
				'<div class="direction-indicator indicator-center"></div>'+
				'<div class="direction-indicator indicator-down"></div>'+
			'</div>',

			controller:function($scope, directionManager){
				$scope.directionManager = directionManager;

				$scope.$watch('directionManager', function(n, o){
					console.log(n,o);
				});
			},
			link:function($scope, $element){

			}
		};
	});

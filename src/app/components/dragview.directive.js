'use strict';

angular.module('imgurapp')

	.directive('dragView', function(){
		return {
			restrict:'A',
			link:function($scope, $element){
				var el = $element;


				function dragStart(evt){

				}

				function dragMove(evt){

				}

				function dragEnd(evt){

				}


				el.addEventListener('touchstart', dragStart);
				el.addEventListener('touchmove', dragMove);
				el.addEventListener('touchend', dragEnd);
			}
		};
	});
'use strict';

angular.module('imgurapp')

	.directive('scrollY', function(){
		return {
			restrict:'A',
			link:function($scope, $element){

				function getCursor(evt){
					if (evt.touches.length > 0){
						return {x:evt.touches[0].pageX,y:evt.touches[0].pageY};
					} else {
						return {x:evt.pageX,y:evt.pageY};
					}
				}

				var el = $element[0];
				var height = 0;
				var delta = {x:0, y:0};
				var lastEvent = false;

				el.addEventListener('touchstart', function(evt){
					height = _.parseInt( window.getComputedStyle(el).height );
					if (height < el.scrollHeight && el.scrollTop === 0){
						el.scrollTop = 1;
					} else if (height < el.scrollHeight && el.scrollTop === el.scrollHeight - height){
						el.scrollTop = el.scrollHeight - height - 1;
					}

					delta.x = 0;
					delta.y = 0;
					lastEvent = getCursor(evt);
				});

				el.addEventListener('touchmove', function(evt){
					var position = getCursor(evt);
							delta.x += position.x - lastEvent.x;
							delta.y += position.y - lastEvent.y;
					if ( Math.abs(delta.y) > Math.abs(delta.x) ){
console.log(delta.x, delta.y)
						evt.stopPropagation();
					}
				})
			}
		}
	})

	.directive('layoutCenter', function(){
		return {
			restrict:'A',
			transclude:true,
			template:'<div class="layout-inner-wrapper" ng-transclude></div>'
		};
	});
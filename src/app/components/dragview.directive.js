'use strict';

angular.module('imgurapp')

	.directive('dragView', function(){
		return {
			restrict:'A',
			link:function($scope, $element){
				var el = $element[0];
				var offset = 0;
				var deltax = 0;
				var deltay = 0;
				var lastEvent = false;
				var width = null;

				function getCursor(evt){
					if (evt.touches.length > 0){
						return {x:evt.touches[0].pageX,y:evt.touches[0].pageY};
					} else {
						return {x:evt.pageX,y:evt.pageY};
					}
				}

				function setPosition(duration){
					el.style.transition = duration ? duration +'ms' : '';
					el.style.transform = 'translate3d('+offset+'px,0,0)';
					el.style['-webkit-transform'] = 'translate3d('+offset+'px,0,0)';
				}


				function dragStart(evt){
					width = _.parseInt( window.getComputedStyle(el).width );
					lastEvent = getCursor(evt);
				}

				function dragMove(evt){
					var currentPosition = getCursor(evt);

					var stepx = currentPosition.x - lastEvent.x;
					var stepy = currentPosition.y - lastEvent.y;


					deltax += stepx;
					deltay += stepy;

					if (Math.abs(deltax) > deltay){
						evt.stopPropagation();
						evt.preventDefault();

						offset += stepx;
						setPosition();
					}

					lastEvent = currentPosition;
				}

				function dragEnd(evt){
					var movedRatio = Math.abs(offset) / width;
					console.log(movedRatio);

					offset = 0;
					setPosition(400);
				}


				el.addEventListener('touchstart', dragStart);
				el.addEventListener('touchmove', dragMove);
				el.addEventListener('touchend', dragEnd);
			}
		};
	});
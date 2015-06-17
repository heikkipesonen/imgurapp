'use strict';

angular.module('imgurapp')

	.factory('rectangle', function(){
		function Rectangle(x,y,width,height){
			this.x = x || 0;
			this.y = y || 0;
			this.width = width || 0;
			this.height = height || 0;
		}

		Rectangle.prototype = {
			contains:function(point){
				return this.x + this.width >= point.x && this.y + this.height >= point.y;
			},

			intersects:function(rectangle){
				return 	this.contains({x:rectangle.x, y:rectangle.y }) ||
								this.contains({x:rectangle.x + rectangle.width, y:rectangle.y + rectangle.height });
			}
		};
	})

	.directive('dragView', function($q, $timeout, $state){
		return {
			restrict:'A',
			link:function($scope, $element, $attrs){
				var el = $element[0];
				var offset = {x:0, y:0};
				var delta = {x:0, y:0};
				var lastEvent = false;
				var width = null;
				var height = null;
				var dragy = $attrs.dragY === 'true';
				var direction = null;

				/**
				 * get cursor position from touch and mouse event
				 * @param  {event} evt
				 * @return {object} {x: int, y: int}
				 */
				function getCursor(evt){
					if (evt.touches.length > 0){
						return {x:evt.touches[0].pageX,y:evt.touches[0].pageY};
					} else {
						return {x:evt.pageX,y:evt.pageY};
					}
				}

				/**
				 * set element position (translate)
				 * @param {int} duration animation duration in milliseconds
				 * @return {Promise}
				 */
				function setPosition(duration){
					var d = $q.defer();

					el.style.transition = duration ? duration +'ms' : '';
					el.style.transform = 'translate3d('+offset.x+'px,'+offset.y+'px,0)';
					el.style['-webkit-transform'] = 'translate3d('+offset.x+'px,'+offset.y+'px,0)';

					$timeout(function(){
						d.resolve(offset);
					}, duration || 1);

					return d.promise;
				}



				/**
				 * draggin started
				 * @param  {mouse event} evt
				 * @return {void}
				 */
				function dragStart(evt){
					var style = window.getComputedStyle(el);
					width = _.parseInt( style.width );
					height = _.parseInt( style.height );
					lastEvent = getCursor(evt);
					delta.x = 0;
					delta.y = 0;
					direction = null;
				}

				/**
				 * dragging is performed
				 * @param  {mouseevent} evt
				 * @return {void}
				 */
				function dragMove(evt){
					var currentPosition = getCursor(evt);

					var stepx = currentPosition.x - lastEvent.x;
					var stepy = currentPosition.y - lastEvent.y;

					delta.x += stepx;
					delta.y += stepy;

					/**
					 * decide scroll direction after first event
					 */
					if (direction === null && Math.abs(delta.x) > Math.abs(delta.y)){
						direction = 'x';
					} else if (direction === null && Math.abs(delta.y) > Math.abs(delta.x)){
						direction = 'y';
					}

					// when direction is clear, proceed blocking the events
					if (direction !== null){
						evt.stopPropagation();
						evt.preventDefault();

						if (direction === 'x'){

							// if nothing can be get from the side, apply rubberband-like tension
							if ( (!$state.current.prev && stepx > 0) || (!$state.current.next && stepx < 0)){
								stepx = stepx*0.3;
							}

							offset.x += stepx;
						} else if (direction === 'y'){
							if ( (!$state.current.down && stepy > 0) || (!$state.current.up && stepy < 0)){
								stepy = stepy*0.3;
							}

							offset.y += stepy;
						}
						setPosition();
					}

					lastEvent = currentPosition;
				}


				/**
				 * drag ends (mouseup, touchend)
				 * @param  {mouseevent} evt
				 * @return {void}
				 */
				function dragEnd(evt){
					var movedRatio = {x: offset.x / width, y: offset.y / height };

					if (Math.abs(movedRatio.x) > 0.4){
						if (movedRatio.x < 0 && $state.current.next){
							el.parentNode.classList.remove('animation-direction-back');
							el.parentNode.classList.add('animation-direction-forward');
							$state.go($state.current.next.name, $state.current.next.params);
							return;
						} else if (movedRatio.x > 0 && $state.current.prev){
							el.parentNode.classList.remove('animation-direction-forward');
							el.parentNode.classList.add('animation-direction-back');
							$state.go($state.current.prev.name, $state.current.prev.params);
							return;
						}
					}

					offset.x = 0;
					offset.y = 0;
					setPosition(400);
				}


				el.addEventListener('touchstart', dragStart);
				el.addEventListener('touchmove', dragMove);
				el.addEventListener('touchend', dragEnd);

				$scope.$on('$destroy', function(){
					el.removeEventListener('touchstart', dragStart);
					el.removeEventListener('touchmove', dragMove);
					el.removeEventListener('touchend', dragEnd);
				});
			}
		};
	});
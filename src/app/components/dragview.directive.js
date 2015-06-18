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

	.directive('dragView', function($q, $timeout, $state, transitionManager, directionManager){
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
				var timer = false;

				var scrollOver = false;

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

				function getExposedSide(){
					var d = null;
					if (direction === 'y'){
						d = delta.y > 0 ? 'up' : delta.y < 0 ? 'down' : null;
					} else if (direction === 'x'){
						d = delta.x > 0 ? 'left' : delta.x < 0 ? 'right' : null;
					}
					return d;
				}

				function endTimer(){
					if (timer) $timeout.cancel(timer);
				}

				function startTimer(delay){
					endTimer();

					timer = $timeout(function(){
						return getExposedSide();
					}, delay || 500);

					return timer;
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

					if (lastEvent){
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
								if ( (!directionManager.left && stepx > 0 && offset.x > 0 ) || (!directionManager.right && stepx < 0 && offset.x < 0)){
									stepx = stepx*0.3;
									startTimer().then(function(side){
										$scope.$emit('drag.hold.'+side);
									});
								}

								offset.x += stepx;
							} else if (direction === 'y'){
								if ( (!directionManager.up && stepy > 0 && offset.y > 0) || (!directionManager.down && stepy < 0 && offset.y < 0)){
									stepy = stepy*0.3;
									startTimer().then(function(side){
										$scope.$emit('drag.hold.'+side);
									});
								}
								offset.y += stepy;
							}

							setPosition();
						}

						lastEvent = currentPosition;
					} else {
						dragStart(evt);
					}
				}


				/**
				 * drag ends (mouseup, touchend)
				 * @param  {mouseevent} evt
				 * @return {void}
				 */
				function dragEnd(evt){
					endTimer();
					lastEvent = false;

					var movedRatio = {x: offset.x / width, y: offset.y / height };

					if (Math.abs(movedRatio.y) > 0.4){
						if (movedRatio.y < 0 && directionManager.down){
							transitionManager.setAnimationDirection('down');
							$state.go(directionManager.down.name, directionManager.down.params);

							offset.y = -height;
							setPosition(200);
							return;
						} else if (movedRatio.y > 0 && directionManager.up){
							transitionManager.setAnimationDirection('up');
							$state.go(directionManager.up.name, directionManager.up.params);

							offset.y = height;
							setPosition(200);
							return;
						}

					}

					if (Math.abs(movedRatio.x) > 0.4){
						if (movedRatio.x < 0 && directionManager.right){
							transitionManager.setAnimationDirection('forward');
							$state.go(directionManager.right.name, directionManager.right.params);

							offset.x = -width;
							setPosition(200);
							return;
						} else if (movedRatio.x > 0 && directionManager.left){
							transitionManager.setAnimationDirection('back');
							$state.go(directionManager.left.name, directionManager.left.params);

							offset.x = width;
							setPosition(200);
							return;
						}
					}

					offset.x = 0;
					offset.y = 0;
					setPosition(400);
				}


				setPosition();
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
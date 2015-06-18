'use strict';

angular.module('imgurapp')

	.directive('dragView', function($q, $timeout, $state, transitionManager, directionManager){
		return {
			restrict:'A',
			link:function($scope, $element){
				var el = $element[0];
				var offset = {x:0, y:0};
				var delta = {x:0, y:0};
				var lastEvent = false;
				var width = null;
				var height = null;
				// var dragy = $attrs.dragY === 'true';
				var direction = null;
				var timer = false;

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

						// step distance from last event
						var stepx = currentPosition.x - lastEvent.x;
						var stepy = currentPosition.y - lastEvent.y;

						// current event distance
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
								}

								// detect hold event on horizontal axis
								// the page has been dragged and held (touch event does not end)
								if (stepx > 0 && offset.x > 0 ||  stepx < 0 && offset.x < 0){
									startTimer().then(function(side){
										$scope.$emit('drag.hold.'+side);
									});
								}

								offset.x += stepx;
							} else if (direction === 'y'){
								if ( (!directionManager.up && stepy > 0 && offset.y > 0) || (!directionManager.down && stepy < 0 && offset.y < 0)){
									stepy = stepy*0.3;
								}

								// detect hold event on vertical  axis
								if (stepy > 0 && offset.y > 0 ||  stepy < 0 && offset.y < 0){
									startTimer().then(function(side){
										console.log(side);
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
				function dragEnd(){
					endTimer();
					lastEvent = false;

					// ratio of page dimensios related to drag distance
					// used for calulcating if page should be changed
					var movedRatio = {x: offset.x / width, y: offset.y / height };


					/**
					 * decide action when dragging has stopped
					 */
					if (Math.abs(movedRatio.y) > 0.4){
						// if drag was down
						if (movedRatio.y < 0 && directionManager.down){
							transitionManager.setAnimationDirection('down');
							directionManager.go('down');

							offset.y = -height;
							setPosition(200);
							return;
						} else if (movedRatio.y > 0 && directionManager.up){ // drag was up
							transitionManager.setAnimationDirection('up');
							directionManager.go('up');

							offset.y = height;
							setPosition(200);
							return;
						}

					}

					// left and right dragging
					if (Math.abs(movedRatio.x) > 0.4){
						if (movedRatio.x < 0 && directionManager.right){
							transitionManager.setAnimationDirection('forward');
							directionManager.go('right');

							offset.x = -width;
							setPosition(200);
							return;
						} else if (movedRatio.x > 0 && directionManager.left){
							transitionManager.setAnimationDirection('back');
							directionManager.go('left');

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

				// remove event listeners when view is destroyed
				$scope.$on('$destroy', function(){
					el.removeEventListener('touchstart', dragStart);
					el.removeEventListener('touchmove', dragMove);
					el.removeEventListener('touchend', dragEnd);
				});
			}
		};
	});
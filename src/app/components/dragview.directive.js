'use strict';

angular.module('imgurapp')

	.directive('dragView', function($q, $timeout, $state, transitionManager, directionManager, Utils){
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
				var velocity = {x:0,y:0}; // current event velocity (px/ms)



				/**
				 * set element position (translate)
				 * @param {int} duration animation duration in milliseconds
				 * @return {Promise}
				 */
				function setPosition(duration){


					var scale = 1-( Math.abs( offset.x ) / (width * 3) || offset.x);

					el.style.transition = duration ? duration +'ms' : '';
					el.style.transform = 'translate3d('+offset.x+'px,'+offset.y+'px,0) scale3d('+scale +','+ scale +',1)';
					el.style['-webkit-transform'] = 'translate3d('+offset.x+'px,'+offset.y+'px,0) scale3d('+scale +', '+scale+',1)';
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
						$scope.$emit('drag.hold.'+ getExposedSide() );
					}, delay || 500);

					return timer;
				}

				/**
				 * dragging started
				 *
				 * reset all required variables and calculate widths & heights of the draggable element
				 * @param  {mouse event} evt
				 * @return {void}
				 */
				function dragStart(evt){
					var style = window.getComputedStyle(el);
					width = _.parseInt( style.width );
					height = _.parseInt( style.height );
					lastEvent = Utils.getCursor(evt);
					delta.x = 0;
					delta.y = 0;
					velocity.x = 0;
					velocity.y = 0;
					direction = null;
				}

				/**
				 * dragging is performed
				 * @param  {mouseevent} evt
				 * @return {void}
				 */
				function dragMove(evt){
					var currentPosition = Utils.getCursor(evt);

					if (lastEvent){

						// step distance from last event
						var stepx = currentPosition.x - lastEvent.x;
						var stepy = currentPosition.y - lastEvent.y;

						// step velocity
						velocity.x = stepx / (currentPosition.timeStamp - lastEvent.timeStamp);
						velocity.y = stepy / (currentPosition.timeStamp - lastEvent.timeStamp);

						// current event distance
						delta.x += stepx;
						delta.y += stepy;


						//decide scroll direction after first event

						if (direction === null && Math.abs(delta.x) > Math.abs(delta.y)){
							direction = 'x';
						} else if (direction === null && Math.abs(delta.y) > Math.abs(delta.x)){
							direction = 'y';
						}
						// when direction is clear, proceed blocking the events
						if (direction !== null){
							evt.stopPropagation();
							evt.preventDefault();

							// if nothing can be get from the side, apply rubberband-like tension
							var tensionX = (!directionManager.left && stepx > 0 && offset.x > 0 ) || (!directionManager.right && stepx < 0 && offset.x < 0) ? 0.3 : 1;
							var tensionY = (!directionManager.up && stepy > 0 && offset.y > 0) || (!directionManager.down && stepy < 0 && offset.y < 0) ? 0.3 : 1;

							stepx = stepx*tensionX;
							stepy = stepy*tensionY;

							if (direction === 'x'){
								// detect hold event on horizontal axis
								// the page has been dragged and held (touch event does not end)
								if (stepx > 0 && offset.x > 0 ||  stepx < 0 && offset.x < 0){
									startTimer();
								}

								offset.x += stepx;
							} else if (direction === 'y'){

								// detect hold event on vertical  axis
								if (stepy > 0 && offset.y > 0 ||  stepy < 0 && offset.y < 0){
									startTimer();
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
					if (Math.abs(movedRatio.y) > 0.4 || Math.abs(velocity.y) > 1){
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
					if (Math.abs(movedRatio.x) > 0.4 || Math.abs(velocity.x) > 1){
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

					velocity.x = 0;
					velocity.y = 0;

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
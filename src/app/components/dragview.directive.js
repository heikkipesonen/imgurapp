'use strict';

angular.module('imgurapp')

	.directive('dragView', function($q, $timeout, $state){
		return {
			restrict:'A',
			link:function($scope, $element){
				var el = $element[0];
				var offset = {x:0, y:0};
				var delta = {x:0, y:0};
				var lastEvent = false;
				var width = null;

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
					el.style.transform = 'translate3d('+offset.x+'px,0,0)';
					el.style['-webkit-transform'] = 'translate3d('+offset.x+'px,0,0)';

					$timeout(function(){
						d.resolve(offset.x);
					}, duration || 1);

					return d.promise;
				}



				/**
				 * draggin started
				 * @param  {mouse event} evt
				 * @return {void}
				 */
				function dragStart(evt){
					width = _.parseInt( window.getComputedStyle(el).width );
					lastEvent = getCursor(evt);
					delta.x = 0;
					delta.y = 0;
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

					if (Math.abs(delta.x) > delta.y){
						evt.stopPropagation();
						evt.preventDefault();

						if ( (!$state.current.prev && stepx > 0) || (!$state.current.next && stepx < 0)){
							stepx = stepx*0.3;
						}

						offset.x += stepx;
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
					var movedRatio = offset.x / width;

					if (Math.abs(movedRatio) > 0.4){
						if (movedRatio < 0 && $state.current.next){
							el.parentNode.classList.remove('animation-direction-back');
							el.parentNode.classList.add('animation-direction-forward');
							$state.go($state.current.next.name, $state.current.next.params);
							return;
						} else if (movedRatio > 0 && $state.current.prev){
							el.parentNode.classList.remove('animation-direction-forward');
							el.parentNode.classList.add('animation-direction-back');
							$state.go($state.current.prev.name, $state.current.prev.params);
							return;
						}
					}

					offset.x = 0;
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
(function(){
	'use strict';

	function DragViewController($scope, $element, $q, $timeout, $state, transitionManager, directionManager, Utils){
		this.options = {
			changeVelocity:0.8,
			changeDragDistance:0.3,
			tension:0.3
		};

		this.$timeout = $timeout;
		this.Utils = Utils;
		this.$scope = $scope;
		this.directionManager = directionManager;
		this.transitionManager = transitionManager;

		this.el = $element[0];
		this.offset = {x:0, y:0};
		this.delta = {x:0, y:0};
		this.lastEvent = false;
		this.width = null;
		this.height = null;
		this.direction = null;
		this.timer = false;
		this.velocity = {x:0,y:0}; // current event velocity (px/ms)

		var me = this;
		// set initial values
		this.setPosition();

		// bind to events
		this.el.addEventListener('touchstart', function(evt){me.dragStart(evt);});
		this.el.addEventListener('touchmove', function(evt){me.dragMove(evt);});
		this.el.addEventListener('touchend', function(evt){me.dragEnd(evt);});
	}

	DragViewController.prototype = {
		/**
		 * set element position (translate)
		 * @param {int} duration animation duration in milliseconds
		 * @return {Promise}
		 */
		setPosition:function(duration){
			// excessive ui animation
			// var scale = 1-( Math.abs( this.offset.x ) / (this.width * 10) || this.offset.x);
			// var rotation = 90*( Math.abs( this.offset.x ) / (this.width ) || this.offset.x);
			// console.log(rotation)

			this.el.style.transition = duration ? duration +'ms' : '';
			this.el.style.transform = 'translate3d('+this.offset.x+'px,'+this.offset.y+'px,0)';
			this.el.style['-webkit-transform'] = 'translate3d('+this.offset.x+'px,'+this.offset.y+'px,0)';
		},

		/**
		 * get exposed underlying side of an dragged element,
		 * the revealed side of the element under draggable, which is the opposite of
		 * drag direction
		 * @return {string} name of the side, up,down,left,right
		 */
		getExposedSide:function(){
			var d = null;
			if (this.direction === 'y'){
				d = this.delta.y > 0 ? 'up' : this.delta.y < 0 ? 'down' : null;
			} else if (this.direction === 'x'){
				d = this.delta.x > 0 ? 'left' : this.delta.x < 0 ? 'right' : null;
			}
			return d;
		},

		/**
		 * cancel timer
		 * @return {null}
		 */
		endTimer:function(){
			if (this.timer) this.$timeout.cancel(this.timer);
		},

		/**
		 * start timer for drag hold event
		 * @param  {int} delay delay in milliseconds
		 * @default 500
		 * @return {object}       promise, timer object
		 */
		startTimer:function(delay){
			var me = this;
			this.endTimer();

			this.timer = this.$timeout(function(){
				me.$scope.$emit('drag.hold.'+ me.getExposedSide() );
			}, delay || 500);

			return this.timer;
		},

		/**
		 * dragging started
		 *
		 * reset all required variables and calculate widths & heights of the draggable element
		 * @param  {mouse event} evt
		 * @return {void}
		 */
		dragStart:function(evt){
			// var style = window.getComputedStyle(this.el);
			// this.width = _.parseInt( style.width );
			// this.height = _.parseInt( style.height );
			this.width = this.el.offsetWidth;
			this.height = this.el.offsetHeight;
			this.lastEvent = this.Utils.getCursor(evt);
			this.delta.x = 0;
			this.delta.y = 0;
			this.velocity.x = 0;
			this.velocity.y = 0;
			this.direction = null;
		},
		/**
		 * on drag event
		 * @param  {mouseevent} evt
		 * @return {void}
		 */
		dragMove:function(evt){
			// get current cursor position
			var currentPosition = this.Utils.getCursor(evt);

			if (this.lastEvent){

				// step distance from last event
				var stepx = currentPosition.x - this.lastEvent.x;
				var stepy = currentPosition.y - this.lastEvent.y;

				// step velocity
				this.velocity.x = stepx / (currentPosition.timeStamp - this.lastEvent.timeStamp);
				this.velocity.y = stepy / (currentPosition.timeStamp - this.lastEvent.timeStamp);

				// current event distance
				this.delta.x += stepx;
				this.delta.y += stepy;


				//decide scroll direction after first event
				if (this.direction === null && Math.abs(this.delta.x) > Math.abs(this.delta.y)){
					this.direction = 'x';
				} else if (this.direction === null && Math.abs(this.delta.y) > Math.abs(this.delta.x)){
					this.direction = 'y';
				}
				// when direction is clear, proceed blocking the events
				if (this.direction !== null){

					// block events if dragging occurs
					// this will disable underlying elements from gettin drag events
					evt.stopPropagation();
					evt.preventDefault();

					// if nothing can be get from the side, apply rubberband-like tension
					var tensionX = (!this.directionManager.left && stepx > 0 && this.offset.x > 0 ) || (!this.directionManager.right && stepx < 0 && this.offset.x < 0) ? this.options.tension : 1;
					var tensionY = (!this.directionManager.up && stepy > 0 && this.offset.y > 0) || (!this.directionManager.down && stepy < 0 && this.offset.y < 0) ? this.options.tension : 1;

					stepx = stepx*tensionX;
					stepy = stepy*tensionY;

					if (this.direction === 'x'){
						// detect hold event on horizontal axis
						// the page has been dragged and held (touch event does not end)
						if (stepx > 0 && this.offset.x > 0 ||  stepx < 0 && this.offset.x < 0){
							this.startTimer();
						}

						// set offset x if this.direction is horizontal
						this.offset.x += stepx;
					} else if (this.direction === 'y'){

						// detect hold event on vertical  axis
						if (stepy > 0 && this.offset.y > 0 ||  stepy < 0 && this.offset.y < 0){
							this.startTimer();
						}

						// set offset y if this.direction is vertical
						this.offset.y += stepy;
					}

					this.setPosition();
				}

				this.lastEvent = currentPosition;
			} else {
				this.dragStart(evt);
			}
		},

	/**
		 * drag ends (mouseup, touchend)
		 * @param  {mouseevent} evt
		 * @return {void}
		 */
		dragEnd:function(){
			this.endTimer();
			this.lastEvent = false;

			// ratio of page dimensios related to drag distance
			// used for calulcating if page should be changed
			var movedRatio = {x: this.offset.x / this.width, y: this.offset.y / this.height };


			/**
			 * decide action when dragging has stopped
			 */
			if (Math.abs(movedRatio.y) > this.options.changeDragDistance || Math.abs(this.velocity.y) > this.options.changeVelocity){
				// if drag was down (moved < 0 and there is something down of here)
				if (movedRatio.y < 0 && this.directionManager.down){
					// set animation to down
					this.transitionManager.setAnimationDirection('down');

					// init state change
					this.directionManager.go('down');

					// set element offset
					this.offset.y = -this.height;
					// animate to offset
					this.setPosition(200);
					return;
				} else if (movedRatio.y > 0 && this.directionManager.up){ // drag was up
					this.transitionManager.setAnimationDirection('up');
					this.directionManager.go('up');
					this.offset.y = this.height;
					this.setPosition(200);
					return;
				}

			}

			// left and right dragging
			if (Math.abs(movedRatio.x) > this.options.changeDragDistance || Math.abs(this.velocity.x) > this.options.changeVelocity){
				if (movedRatio.x < 0 && this.directionManager.right){
					this.transitionManager.setAnimationDirection('forward');
					this.directionManager.go('right');

					this.offset.x = -this.width;
					this.setPosition(200);
					return;
				} else if (movedRatio.x > 0 && this.directionManager.left){
					this.transitionManager.setAnimationDirection('back');
					this.directionManager.go('left');

					this.offset.x = this.width;
					this.setPosition(200);
					return;
				}
			}


			// reset variables (drag end)
			this.velocity.x = 0;
			this.velocity.y = 0;
			this.offset.x = 0;
			this.offset.y = 0;

			// set element position to zero (css actually overrides this to disable flickering)
			this.setPosition(400);
		}
	};

angular.module('imgurapp')

	.controller('DragViewController', DragViewController)

	.directive('dragView', function(){
		return {
			restrict:'A',
			controller:'DragViewController'
		};
	});

})();


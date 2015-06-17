  'use strict';

  angular.module('imgurapp')


  	/**
  	 * manages application drag directions
  	 * dragview allows movement to specified directions according to this service
  	 */
  	.service('directionManager', function(){
  		angular.extend(this, {
  			up:null,
  			left:null,
  			right:null,
  			down:null,

  			set:function(direction, params){
  				this[direction] = params || null;
  			},

  			get:function(direction){
  				return this[direction];
  			},

  			isset:function(direction){
  				return this[direction] !== null;
  			}
  		});
  	});
(function(){

  'use strict';

  angular.module('imgurapp')


  	/**
  	 * manages application drag directions
  	 * dragview allows movement to specified directions according to this service
  	 */
  	.service('directionManager', function($state){
  		angular.extend(this, {
  			up:null,
  			left:null,
  			right:null,
  			down:null,

  			set:function(direction, params){
  				this[direction] = params || null;
  				return this;
  			},

  			get:function(direction){
  				return this[direction];
  			},

  			isset:function(direction){
  				return this[direction] !== null;
  			},

  			go:function(direction){
  				if (this[direction]){
  					$state.go(this[direction].name, this[direction].params);
  				}
  			}
  		});
  	});
  })();
(function(){

  'use strict';

  angular.module('imgurapp')


  .service('transitionManager',function(){
  	angular.extend(this, {
  		el:document.body,

  		direction:'forward',

  		prefix:'animation-direction-',

  		directions:['forward','back','up','down'],

  		setAnimationDirection : function(direction){
  			var me = this;
  			this.direction = direction || this.direction;
  			_.forEach(this.directions, function(d){

  				if (d === me.direction){
  					me.el.classList.add(me.prefix + me.direction);
  				} else {
  				 	me.el.classList.remove(me.prefix + d);
  				}
  			});
  		}
  	});
  });
})();
(function(){


  'use strict';

  angular.module('imgurapp')

  	.service('favorites', function(){
  		angular.extend(this, {
  			items:[],

  			add:function(item){
  				if (this.items.indexOf(item) < 0){
  					this.items.push(item);
  				}
  			},

  			remove:function(item){
  				if (this.items.indexOf(item) > -1){
  					this.items.splice(this.items.indexOf(item), 1);
  				}
  			}
  		});
  	});
})();
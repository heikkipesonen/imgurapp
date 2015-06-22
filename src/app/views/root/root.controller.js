(function(){
'use strict';

function RootController(){
	this.homeScroll = {
		x:0,
		y:0
	}
}

angular.module('imgurapp')
  .controller('RootController',RootController);

})();

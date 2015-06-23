(function(){
'use strict';

function RootController(){
	this.homeScroll = {
		x:0,
		y:0
	};

	this.abortStateChange = function(){
		window.history.back();
	}
}

angular.module('imgurapp')
  .controller('RootController',RootController);

})();

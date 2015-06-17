(function(){

'use strict';

	function GalleryController(nextGallery, prevGallery){
		this.next = nextGallery;
		this.prev = prevGallery;
	}


	GalleryController.prototype = {

	}

	angular.module('imgurapp')
	  .controller('GalleryController', GalleryController);
})();

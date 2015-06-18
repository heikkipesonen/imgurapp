(function(){

'use strict';

	function GalleryController(nextGallery, prevGallery){
		this.next = nextGallery;
		this.prev = prevGallery;

		/**
		 * scroll model for scroll-y directive in gallery.page.controller
		 * object because objects are nice things
		 * @type {Object}
		 */
		this.scroll = {
			x:0,
			y:0
		};
	}


	GalleryController.prototype = {

	}

	angular.module('imgurapp')
	  .controller('GalleryController', GalleryController);
})();

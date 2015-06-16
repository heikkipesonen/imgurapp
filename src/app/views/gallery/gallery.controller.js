(function(){

'use strict';

	function GalleryController(appConfig, $http, galleryImages){
		var me = this;
		this.images = galleryImages;
	}

	GalleryController.prototype = {

	}

	angular.module('imgurapp')
	  .controller('GalleryController', GalleryController);
})();

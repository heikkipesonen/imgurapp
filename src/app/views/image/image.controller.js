(function(){

'use strict';

	function ImageController(appConfig, $http, image, $state){
		this.config = appConfig;
		this.http = $http;
		this.image = image;

		var me = this;
		console.log(image);
		this.images = [];
	}

	ImageController.prototype = {
		getGallery:function(){

		}
	}

	angular.module('imgurapp')
	  .controller('ImageController', ImageController);
})();

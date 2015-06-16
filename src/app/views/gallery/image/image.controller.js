(function(){

'use strict';

	function ImageController(appConfig, $http, image, $state, nextImage, prevImage){
		this.image = image;
		// if (this.image.is_album){
		// 	this.getAlbum().then(function(album){
		// 		me.images = album.images;
		// 	});

		// } else {
		// 	this.images.push(this.image);
		// }


		$state.current.next = {
			name:'gallery.image',
			params:{
				imageId:nextImage.id
			}
		};

		$state.current.prev = {
			name:'gallery.image',
			params:{
				imageId:prevImage.id
			}
		};

	}

	ImageController.prototype = {
		// getAlbum:function(){
		// 	return this.http.get(this.config.api +'/album/'+this.image.id).then(function(response){
		// 		return response.data.data;
		// 	});
		// }
	}

	angular.module('imgurapp')
	  .controller('ImageController', ImageController);
})();

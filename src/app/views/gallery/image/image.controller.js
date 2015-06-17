(function(){

'use strict';

	function ImageController(image, $state, nextImage, prevImage, $timeout, $http, appConfig){
		var me = this;
		this.image = image;

		if (this.image.is_album){
      $http.get(appConfig.api +'/album/'+this.image.id).then(function(response){
        me.image.images = response.data.data.images;
      });
		}



		$state.current.up = {
			name:'gallery.page',
			params:{
				galleryId: $state.params.galleryId,
				type: $state.params.type
			}
		};

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
	}

	angular.module('imgurapp')
	  .controller('ImageController', ImageController);
})();

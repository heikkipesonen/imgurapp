(function(){

'use strict';

	function ImageController(image, $state, nextImage, prevImage, imgurApi, directionManager){
		var me = this;

		this.image = image;
		this.thumbnails = [];
		this.thumbnailSize = null;

		if (!this.image.animated){
			this.thumbnailSize = imgurApi.findThumbnail(window.innerWidth).name;
		}

		if (this.image.is_album){
			imgurApi.getAlbum(image.id).then(function(album){
				me.thumbnails = album.images;
			});
      // $http.get(appConfig.api +'/album/'+this.image.id).then(function(response){
      //   me.image.images = response.data.data.images;
      // });
		}

		directionManager.set('up',{
			name:'root.gallery.page',
			params:{
				galleryId: $state.params.galleryId,
				type: $state.params.type
			}
		});

		directionManager.set('right',{
			name:'root.gallery.image',
			params:{
				imageId:nextImage.id
			}
		});

		directionManager.set('left',{
			name:'root.gallery.image',
			params:{
				imageId:prevImage.id
			}
		});

		directionManager.set('down', null);
	}

	ImageController.prototype = {
	}

	angular.module('imgurapp')
	  .controller('ImageController', ImageController);
})();

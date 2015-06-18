(function(){

'use strict';

	function ImageController(image, $state, $stateParams, nextImage, prevImage, imgurApi, directionManager){
		var me = this;

		this.image = image;
		this.thumbnails = [];
		this.imageSize = null;
		this.thumbnailSize = imgurApi.findThumbnail(window.innerWidth/3);

		if (!this.image.animated){
			if (this.image.height > this.image.width * 2){
				this.imageSize = imgurApi.findThumbnail(window.innerHeight);

				if (this.imageSize.width / this.image.height * this.image.width < window.innerWidth){
					this.imageSize = null;
				}
			} else {
				this.imageSize = imgurApi.findThumbnail(window.innerWidth);
			}
		}

		if (this.image.is_album){
			imgurApi.getAlbum(image.id).then(function(album){
				me.images = image.images = album.images;

				directionManager.set('down', {
					name:'root.gallery.album',
					params:{
						galleryId:$stateParams.galleryId,
						imageId:$stateParams.imageId,
						albumImageId:_.first(me.images).id
					}
				});
			});
		}

		directionManager.set('up',{
			name:'root.gallery.page',
			params:{
				galleryId: $stateParams.galleryId,
				type: $stateParams.type
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

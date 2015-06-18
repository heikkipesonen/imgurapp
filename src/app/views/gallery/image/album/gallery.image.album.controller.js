(function(){

'use strict';

	function ImageAlbumController($state, $stateParams, albumImage, nextAlbumImage, prevAlbumImage, imgurApi, directionManager){
		var me = this;

		this.image = albumImage;
		this.thumbnails = [];
		this.imageSize = null;
		this.thumbnailSize = imgurApi.findThumbnail(window.innerWidth/3);

		if (!this.image.animated){
			this.imageSize = imgurApi.findThumbnail(window.innerWidth);
		}
console.log(this.image)
		directionManager.set('up',{
			name:'root.gallery.image',
			params:{
				type: $stateParams.type,
				galleryId: $stateParams.galleryId,
				imageId: $stateParams.imageId,
			}
		});

		directionManager.set('right',{
			name:'root.gallery.album',
			params:{
				type: $stateParams.type,
				galleryId: $stateParams.galleryId,
				imageId: $stateParams.imageId,
				albumImageId: nextAlbumImage.id
			}
		});

		directionManager.set('left',{
			name:'root.gallery.album',
			params:{
				type: $stateParams.type,
				galleryId: $stateParams.galleryId,
				imageId: $stateParams.imageId,
				albumImageId: prevAlbumImage.id
			}
		});

		directionManager.set('down', null);
	}

	ImageAlbumController.prototype = {
	}

	angular.module('imgurapp')
	  .controller('ImageAlbumController', ImageAlbumController);
})();

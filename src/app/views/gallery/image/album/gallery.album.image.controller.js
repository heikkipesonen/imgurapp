(function(){

'use strict';

	function AlbumImageController($state, $stateParams, album, albumImage, albumImagePosition, nextAlbumImage, prevAlbumImage, imgurApi, directionManager){

		this.album = album;
		this.image = albumImage;
		this.thumbnails = [];
		this.imageSize = null;
		this.position = albumImagePosition.index+1 + '/' + albumImagePosition.count;

		if (!this.image.animated){
			this.imageSize = imgurApi.findThumbnail(window.innerWidth);
		}

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

	AlbumImageController.prototype = {};

	angular.module('imgurapp')
	  .controller('AlbumImageController', AlbumImageController);
})();

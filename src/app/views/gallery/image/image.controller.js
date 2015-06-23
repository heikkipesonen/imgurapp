(function(){

'use strict';

	function ImageController(image, $state, $stateParams, nextImage, prevImage, imgurApi, directionManager, Utils){
		// var imageController = this;

		this.image = image;
		this.thumbnails = [];
		this.imageSize = null;
		// this.thumbnailSize = imgurApi.findThumbnail(window.innerWidth * window.devicePixelRatio / 4);

		// check if image is not an animation, if it is do not resize
		// else get suitable thumbnail for screen size
		if (this.image && !this.image.animated){
			// if image has outragous aspect ratio
			this.imageSize = imgurApi.findThumbnail(window.innerWidth * window.devicePixelRatio);
			// if (this.image.height > this.image.width * 2){

			// 	// find almost correct image from api image sizes

			// 	// if image has horrible aspect ratio, get the original one
			// 	if (this.imageSize.width / this.image.height * this.image.width < window.innerWidth){
			// 		this.imageSize = null;
			// 	}

			// } else {

			// 	this.imageSize = imgurApi.findThumbnail(window.innerWidth);
			// }
		}

		// if this is an album, not an image, then album is fetched from imgur api
		// if (this.image && this.image.is_album){
		// 	imgurApi.getAlbum(image.id).then(function(album){
		// 		console.log(album);

		// 		var gridItemSize = window.innerWidth/4;
		// 		imageController.grid = Utils.makeGrid(album.images, gridItemSize, 10);
		// 		// me.images = image.images = album.images;

		// 		// _.forEach( me.images, function(image){
		// 		// 	image.href = $state.href('root.gallery.album', {galleryId: $stateParams.galleryId, imageId: me.image.id, albumImageId: image.id});
		// 		// });

		// 		// set down as available drag direction to reveal
		// 		// gallery contents as images
		// 		directionManager.set('down', {
		// 			name:'root.gallery.album',
		// 			params:{
		// 				galleryId:$stateParams.galleryId,
		// 				imageId:$stateParams.imageId,
		// 				albumImageId:_.first(imageController.grid.items).id
		// 			}
		// 		});
		// 	});
		// }


		// setup available directions for dragging
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
	};

	angular.module('imgurapp')
	  .controller('ImageController', ImageController);
})();

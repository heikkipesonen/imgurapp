(function(){

'use strict';

	function ImageController(image, $state, imagePosition, $stateParams, nextImage, prevImage, imgurApi, directionManager, Utils){
		// var imageController = this;

		this.image = image;
		this.thumbnails = [];
		this.imageSize = null;
		this.position = imagePosition.index +1 + '/' + imagePosition.count;

		// imgurApi.getComments(this.image.id).then(function(comments){
		// 	console.log(comments);
		// })


		// check if image is not an animation, if it is do not resize
		// else get suitable thumbnail for screen size
		if (this.image && !this.image.animated){
			// if image has outragous aspect ratio
			this.imageSize = imgurApi.findThumbnail(window.innerWidth * window.devicePixelRatio);
		}

		// setup available directions for dragging
		directionManager.set('up',{
			name:'root.gallery.page',
			params:{
				galleryId: $stateParams.galleryId,
				type: $stateParams.type,
				page: $stateParams.galleryPage
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

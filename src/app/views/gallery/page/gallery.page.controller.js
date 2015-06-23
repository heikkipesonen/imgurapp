(function(){

'use strict';

	function GalleryPageController($scope, $http, $stateParams, $state, $timeout, imgurApi, galleryImages, Utils, nextGallery, prevGallery, directionManager){

		// name displayed on galleri page
		this.name = $stateParams.type + '/' + $stateParams.galleryId;

		// next and previous gallery page
		this.next = nextGallery;
		this.prev = prevGallery;

		// thumbnail images for gallery, take account devicePixelRatio
		this.thumbnailSize = imgurApi.findThumbnail( window.innerWidth * window.devicePixelRatio / 4 );

		/**
		 * make thumbnails (add 's' on image file name)
		 */
		var thumbnails = galleryImages.map(function(image){
			image.href = $state.href('root.gallery.image', {imageId: image.id});
			return image;
		});

		var gridItemSize = window.innerWidth/4;
		this.grid = Utils.makeGrid(thumbnails, gridItemSize);
console.log(this.grid);
		/**
		 * state link object
		 * @type {Object}
		 */
		directionManager.set('right',{
			name:'root.gallery.page',
			params:{
				type:nextGallery.split('/')[0],
				galleryId:nextGallery.split('/')[1]
			}
		});

		directionManager.set('left',{
			name :'root.gallery.page',
			params: {
				type:prevGallery.split('/')[0],
				galleryId:prevGallery.split('/')[1]
			}
		});

		if (galleryImages && galleryImages.length > 0){
			directionManager.set('down',{
				name :'root.gallery.image',
				params: {
					imageId:_.first(galleryImages).id
				}
			});
		} else {
			directionManager.set('down');
		}

		directionManager.set('up', {
			name:'root.home',
			params:{}
		});
	}


	GalleryPageController.prototype = {

	};

	angular.module('imgurapp')
	  .controller('GalleryPageController', GalleryPageController);
})();

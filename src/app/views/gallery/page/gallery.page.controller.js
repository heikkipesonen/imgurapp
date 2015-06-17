(function(){

'use strict';

	function GalleryPageController($scope, $http, $stateParams, $state, $timeout, galleryImages, Utils, nextGallery, prevGallery, directionManager){
		this.name = $stateParams.type + '/' + $stateParams.galleryId;
		this.next = nextGallery;
		this.prev = prevGallery;

		/**
		 * make thumbnails (add 's' on image file name)
		 */
		this.thumbnails = galleryImages.map(function(image){
			image.href = $state.href('root.gallery.image', {imageId: image.id});
			return image;
		});



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

		directionManager.set('up');
	}


	GalleryPageController.prototype = {

	}

	angular.module('imgurapp')
	  .controller('GalleryPageController', GalleryPageController);
})();
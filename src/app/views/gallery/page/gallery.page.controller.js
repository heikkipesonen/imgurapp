(function(){

'use strict';

	function GalleryPageController($stateParams, galleryImages, nextGallery, prevGallery, directionManager, thumbnails){

		// name displayed on galleri page
		this.name = $stateParams.type + '/' + $stateParams.galleryId;
		this.thumbnails = thumbnails;

		// next and previous gallery page
		this.next = nextGallery;
		this.prev = prevGallery;

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

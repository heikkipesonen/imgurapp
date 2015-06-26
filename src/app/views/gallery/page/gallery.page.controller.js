(function(){

'use strict';

	function GalleryPageController($stateParams, galleryImages, nextGallery, prevGallery, directionManager, thumbnails){

		// name displayed on galleri page
		this.name = $stateParams.type + '/' + $stateParams.galleryId;
		this.thumbnails = thumbnails;
		this.page = _.parseInt( $stateParams.galleryPage );

		// next and previous gallery page
		this.next = nextGallery;
		this.prev = prevGallery;

		var nextGalleryParts = nextGallery.split('/');
		var prevGalleryParts = prevGallery.split('/');

		/**
		 * state link object
		 * @type {Object}
		 */
		directionManager.set('right',{
			name:'root.gallery.page',
			params:{
				type:nextGalleryParts[0],
				galleryId:nextGalleryParts[1],
				galleryPage:0
			}
		});

		directionManager.set('left',{
			name :'root.gallery.page',
			params: {
				type:prevGalleryParts[0],
				galleryId:prevGalleryParts[1],
				galleryPage:0
			}
		});

		directionManager.set('down',{
			name :'root.gallery.page',
			params: {
				type:$stateParams.type,
				galleryId:$stateParams.galleryId,
				galleryPage: this.page + 1
			}
		});

		// if (galleryImages && galleryImages.length > 0){
		// } else {
		// 	directionManager.set('down');
		// }
		if (this.page > 0){
			directionManager.set('up',{
				name :'root.gallery.page',
				params: {
					type:$stateParams.type,
					galleryId:$stateParams.galleryId,
					galleryPage: this.page - 1
				}
			});
		} else {

			directionManager.set('up', {
				name:'root.home',
				params:{}
			});
		}
	}


	GalleryPageController.prototype = {

	};

	angular.module('imgurapp')
	  .controller('GalleryPageController', GalleryPageController);
})();

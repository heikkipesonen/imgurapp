(function(){

'use strict';

	function GalleryController(appConfig, $http, galleryImages, $state, Utils){
		/**
		 * make thumbnails (add 's' on image file name)
		 */
		this.thumbnails = galleryImages.map(function(image){
			return {
				src: Utils.getThumbnail(image),
				href: $state.href('gallery.image', {imageId: image.id})
			};
		});


		/**
		 * get next and prev items
		 * yesyes array[0] and [1]
		 */
		var next = _.first(galleryImages);
		var prev = _.last(galleryImages);

		/**
		 * state link object
		 * @type {Object}
		 */
		$state.current.next = {
			name:'gallery.image',
			params:{
				imageId:next.id
			}
		};

		$state.current.prev = {
			name :'gallery.image',
			params: {
				imageId:prev.id
			}
		};
	}


	GalleryController.prototype = {

	}

	angular.module('imgurapp')
	  .controller('GalleryController', GalleryController);
})();

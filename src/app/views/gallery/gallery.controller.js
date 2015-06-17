(function(){

'use strict';

	function GalleryController($scope, $http, $stateParams, $state, galleryImages, Utils){
		this.name = $stateParams.type + '/' + $stateParams.galleryId;

		/**
		 * make thumbnails (add 's' on image file name)
		 */
		this.thumbnails = galleryImages.map(function(image){
			return {
				src: Utils.getThumbnail(image),
				href: $state.href('gallery.image', {imageId: image.id})
			};
		});

		// $scope.$on('drag.hold.up', function(){
		// 	console.log('holdup')
		// });
		// $scope.$on('drag.hold.down', function(){
		// 	console.log('holddownp')
		// });
		/**
		 *
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

		this.imageClick = function(image){
			console.log(image);
		}
	}


	GalleryController.prototype = {

	}

	angular.module('imgurapp')
	  .controller('GalleryController', GalleryController);
})();

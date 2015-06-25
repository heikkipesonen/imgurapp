(function(){

'use strict';

	function ImageController($rootScope, $scope, $state, $timeout,  image, imagePosition, $stateParams, nextImage, prevImage, imgurApi, directionManager, imageSize){
		// var imageController = this;
		var imageController = this;
		this.image = image;
		this.thumbnails = [];
		this.imageSize = imageSize.getResizedImage(this.image, window.innerWidth * window.devicePixelRatio);
		// this.position = imagePosition.index +1 + '/' + imagePosition.count;

		this.commentsLoaded = false;
		this.comments = [];
		this.commentLimit = 10;
		this.loadingComments = false;
		// imgurApi.getComments(this.image.id).then(function(comments){
		// 	console.log(comments);
		// })

		this.loadComments = function(evt){
			if (!imageController.commentsLoaded){
				this.loadingComments = true;
				return imgurApi.getComments(imageController.image.id).then(function(comments){
					imageController.comments = comments;
					if (imageController.comments.length > 0){
						$timeout(function(){
							$scope.$broadcast('scroll.toAnimated', document.getElementById('image-comments'));
						},200);
					}
				}).finally(function(){
					imageController.commentsLoaded = true;
					imageController.loadingComments = false;
				});
			}
		};

		this.showMoreComments = function(){
			this.commentLimit += 10;
		};

		$scope.$on('drag.hold.down', function(){
			imageController.loadComments();
		});

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

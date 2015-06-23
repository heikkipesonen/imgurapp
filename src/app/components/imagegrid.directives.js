'use strict';

angular.module('imgurapp')

	.directive('imageLoader', function(imgurApi){
		return {
			restrict:'A',
			scope:{
				imageLoader:'='
			},
			link:function($scope, $element, $attrs){
				var el = $element[0];
				var img = null;

				function loadComplete(){
					el.classList.remove('image-loading');
					el.classList.add('image-ready');

					if (el.nodeName === 'IMG'){
						el.src = img.src;
					} else {
						el.style['background-image'] = 'url('+img.src+')';
					}

					img = null;
				}

				function preload(){
					el.classList.add('image-loading');
					el.classList.remove('image-ready');

					img = new Image();

					img.onload = function(){
						loadComplete();
					};

					img.onerror = function(){
						loadComplete();
					};

					if ( /\.(gif|jpg|jpeg|png)$/i.test($scope.imageLoader.link)){
						if ($attrs.thumbnail && $attrs.thumbnail !== ''){
							img.src = imgurApi.getThumbnail($scope.imageLoader.link, $attrs.thumbnail);
						} else {
							img.src = $scope.imageLoader.link;
						}
					} else {
						img.src = null;
					}

					if ( $scope.imageLoader.width > $scope.imageLoader.height * 1.5 ){
						el.classList.add('image-wide');
					} else if ($scope.imageLoader.height > $scope.imageLoader.width * 1.5){
						el.classList.add('image-tall');
					} else if ($scope.imageLoader.width > 2048 && $scope.imageLoader.height > 2048){
						el.classList.add('image-large');
					}
				}

				$scope.$watch('imageLoader', function(newVal, oldVal){
					if (newVal === oldVal && img && img.src) return;
					preload();
				});
			}
		};
	})

	.directive('imageGrid', function(){
		return {
			restrict:'A',
			scope:{
				imageGrid:'=',
				thumbnail:'@'
			},

			template:'<a '+
				'ng-href="{{::image.href}}"'+
				'class="grid-image"'+
				'image-loader="::image"'+
				'thumbnail="{{thumbnail}}"'+
				'ng-repeat="(imageIndex, image) in imageGrid track by image.id">'+
			'</a>'
		};
	})

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
					var image = $scope.imageLoader;

					el.classList.add('image-loading');
					el.classList.remove('image-ready');

					img = new Image();

					img.onload = function(){
						loadComplete();
					};

					img.onerror = function(){
						loadComplete();
					};

					if ( /\.(gif|jpg|jpeg|png)$/i.test(image.link)){
						if ($attrs.thumbnail && $attrs.thumbnail !== ''){
							img.src = imgurApi.getThumbnail(image.link, $attrs.thumbnail);
						} else {
							img.src = image.link;
						}
					} else {
						img.src = null;
					}
				}

				preload();
				// $scope.$watch('imageLoader', function(newVal, oldVal){
				// 	if (newVal === oldVal && img && img.src) return;
				// 	preload();
				// });
			}
		};
	})

	.directive('gridImage', function(imgurApi){
		return {
			restrict:'A',
			scope:{
				gridImage:'=',
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
					var item = $scope.gridImage;

					el.classList.add('image-loading');
					el.classList.remove('image-ready');

					img = new Image();

					img.onload = function(){
						loadComplete();
					};

					img.onerror = function(){
						loadComplete();
					};

					if ( /\.(gif|jpg|jpeg|png)$/i.test(item.image.link)){
						if (item.thumbnail){
							img.src = imgurApi.getThumbnail(item.image.link, item.thumbnail.name);
						} else {
							img.src = item.image.link;
						}
					} else {
						img.src = null;
					}

					el.style.position = 'absolute';
					el.style.left = item.left + 'px';
					el.style.top = item.top + 'px';
					el.style.width = item.width + 'px';
					el.style.height = item.height + 'px';
				}
				preload();
				// $scope.$watch('gridImage', function(newVal, oldVal){
				// 	if (newVal === oldVal && img && img.src) return;
				// 	preload();
				// });
			}
		};
	})
	.directive('imageGrid', function(){
		return {
			restrict:'A',
			scope:{
				imageGrid:'='
			},
			link:function($scope, $element){
				$element.css('height', $scope.imageGrid.height+'px');
			},
			template:
			'<div class="image-grid">'+
				'<a '+
					'ng-href="{{::item.image.href}}"'+
					'class="grid-image"'+
					'grid-image="::item"'+
					'ng-repeat="(itemIndex, item) in imageGrid.items track by item.image.id">'+
				'</a>'+
			'</div>'
		};
	})

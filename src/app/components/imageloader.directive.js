(function(){
'use strict';

angular.module('imgurapp')

	.directive('imageLoader', function(imgurApi, appConfig){
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

					if (image.nsfw) el.classList.add('image-nsfw');
					if (appConfig.nsfwFilter !== true || image.nsfw !== true){
						el.classList.add('image-loading');
						el.classList.remove('image-ready');
						img = new Image();

						img.onload = function(){
							loadComplete();
						};

						img.onerror = function(){
							loadComplete();
						};

						var link = image.link;

						if ( /\.(gif|jpg|jpeg|png|gifv|mp4)$/i.test(link)){
							if ($attrs.thumbnail && $attrs.thumbnail !== ''){
								img.src = imgurApi.getThumbnail(link, $attrs.thumbnail);
							} else {
								img.src = link;
							}
						} else {
							img.src = null;
						}
					} else {
						el.classList.add('image-ready');
						el.classList.add('image-nsfw-blocked');
					}
				}

				preload();
				// $scope.$watch('imageLoader', function(newVal, oldVal){
				// 	if (newVal === oldVal && img && img.src) return;
				// 	preload();
				// });
			}
		};
	});
})();
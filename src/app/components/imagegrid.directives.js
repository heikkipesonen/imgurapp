'use strict';

angular.module('imgurapp')


	.directive('gridImage', function(imgurApi, appConfig){
		return {
			restrict:'A',
			scope:{
				gridImage:'=',
			},
			link:function($scope, $element){
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

					if (item.image.nsfw) el.classList.add('image-nsfw');
					if (appConfig.nsfwFilter !== true || item.image.nsfw !== true){

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
					} else {
						el.classList.add('image-ready');
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
					'ng-repeat="(itemIndex, item) in imageGrid.items track by itemIndex">'+
				'</a>'+
			'</div>'
		};
	});

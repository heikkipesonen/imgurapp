'use strict';

angular.module('imgurapp')

	.directive('imageLoader', function(){
		return {
			scope:{
				imageLoader:'='
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
					el.classList.add('image-loading');
					el.classList.remove('image-ready');

					img = new Image();
					img.onload = function(){
						loadComplete();
					};

					img.onError = function(){
						loadComplete();
					};

					img.src = $scope.imageLoader;
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
			scope:{
				imageGrid:'='
			},
			replace:true,
			template:'<div class="image-grid">'+
									'<a href="{{image.href}}" ng-repeat="(imageIndex, image) in imageGrid track by imageIndex">'+
										'<div image-loader="image.src"></div>'+
									'</a>'+
								'</div>'
		};
	})

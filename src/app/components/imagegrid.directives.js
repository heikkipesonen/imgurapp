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

					var filename = $scope.imageLoader.is_album ? null : $scope.imageLoader.link.replace($scope.imageLoader.id, $scope.imageLoader.id+'s');
					if ($scope.imageLoader.is_album){
						console.log($scope.imageLoader)
					}
					img.src = filename;
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
			template:'<div class="image-grid">'+
									'<div image-loader="image" ng-repeat="(imageIndex, image) in imageGrid"></div>'+
								'</div>'
		};
	})

'use strict';

angular.module('imgurapp')

.service('Utils', function($state){
	angular.extend(this, {

		findClosest:function(array, value){
			return array.reduce(function (prev, curr) {
			  return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
			});
		},

		getThumbnail:function(url, size){
			url = typeof(url) === 'object' ? url.link : url;
			size = size ? size : 's';
			var parts = url.split('.');
			var end = parts.splice(parts.length-2, 2);
					end[0] += size;

			return _.union(parts, end).join('.');
		},

		getGalleryLink:function(name){
			var parts = name.split('/');
			return $state.href('root.gallery.page',{
				type:parts[0],
				galleryId:parts[1]
			});
		},

		nextItem : function(array, item){
			var currentIndex = array.indexOf(item);
			return currentIndex > -1 ? currentIndex < array.length-1 ? array[currentIndex+1] : array[0] : null;
		},

		prevItem : function(array, item){
			var currentIndex = array.indexOf(item);
			return currentIndex > -1 ? currentIndex > 0 ? array[currentIndex-1] : array[array.length-1] : null;
		}

	});
});
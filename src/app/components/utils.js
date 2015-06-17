'use strict';

angular.module('imgurapp')

.service('Utils', function(){
	angular.extend(this, {
		getThumbnail:function(url, size){
			url = typeof(url) === 'object' ? url.link : url;
			size = size ? size : 's';
			var parts = url.split('.');
			var end = parts.splice(parts.length-2, 2);
					end[0] += size;

			return _.union(parts, end).join('.');
		}

	});
});
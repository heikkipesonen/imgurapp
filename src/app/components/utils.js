'use strict';

angular.module('imgurapp')

.service('Utils', function($state){
	angular.extend(this, {

		/**
		 * get cursor position of touch or mouse event
		 * @param  {event} evt
		 * @return {object}     {x: int, y: int}
		 */
		getCursor:function(evt){
			if (evt.touches.length > 0){
				return {x:evt.touches[0].pageX,y:evt.touches[0].pageY};
			} else {
				return {x:evt.pageX,y:evt.pageY};
			}
		},

		/**
		 * find closest value from array of values
		 * @param  {array} array array of values
		 * @param  {int} value value to match
		 * @return {int}       closest value
		 */
		findClosest:function(array, value){
			return array.reduce(function (prev, curr) {
			  return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
			});
		},

		/**
		 * get thumbnail url from imgur image
		 * @param  {string} url  image url
		 * @param  {string} size imgur thumbnail size
		 * @return {string}      thumbnail image url
		 */
		getThumbnail:function(url, size){
			url = typeof(url) === 'object' ? url.link : url;
			size = size ? size : 's';
			var parts = url.split('.');
			var end = parts.splice(parts.length-2, 2);
					end[0] += size;

			return _.union(parts, end).join('.');
		},

		/**
		 * compose string link to gallery
		 * @param  {string} name gallery id
		 * @return {strign}      href link for ui-router
		 */
		getGalleryLink:function(name){
			var parts = name.split('/');
			return $state.href('root.gallery.page',{
				type:parts[0],
				galleryId:parts[1]
			});
		},

		/**
		 * get next item of array
		 * if next is the last, return first one
		 * @param  {array} array
		 * @param  {object | string | int} item  current item
		 * @return {object | string | int}       item of whatever is in the array at index of next
		 */
		nextItem : function(array, item){
			var currentIndex = array.indexOf(item);
			return currentIndex > -1 ? currentIndex < array.length-1 ? array[currentIndex+1] : array[0] : null;
		},

		/**
		 * get prev item of array
		 * if previous is the first, return last one
		 * @param  {array} array
		 * @param  {object | string | int} item  current item
		 * @return {object | string | int}       item of whatever is in the array at index of prev
		 */
		prevItem : function(array, item){
			var currentIndex = array.indexOf(item);
			return currentIndex > -1 ? currentIndex > 0 ? array[currentIndex-1] : array[array.length-1] : null;
		}

	});
});
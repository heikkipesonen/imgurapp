'use strict';

angular.module('imgurapp')


.service('Utils', function($state){
	angular.extend(this, {

		/**
		 * generate grid of images
		 * (C) joni
		 * @param  {array} images
		 * @return {array}        list of images
		 */
		makeGrid:function(images, gridSize, gutter){
	    var Utils = this;
	    var grid = [];
	    var gridWidth = 4;
	    var sY = 0;

	    var reservePoint = function (x, y, id) {
	        if (!grid[y]) {
	            grid[y] = [false, false, false, false];
	        }
	        grid[y][x] = id;
	    };

	    var getPoints = function (sx, sy, size) {
	        var points = [];
	        for (var x = sx; x < sx + size.w; x++) {
	            for (var y = sy; y < sy + size.h; y++) {
	                points.push({
	                    x: x,
	                    y: y
	                });
	            }
	        }
	        return points;
	    };

	    var reserveGrid = function (x, y, size, id) {
	        getPoints(x, y, size).forEach(function (point) {
	            reservePoint(point.x, point.y, id);
	        });

	        for (var y = sY; y < grid.length; y++) {
	            if (grid[y].every(function (id) {
	                return id;
	            })) {
	                sY = y + 1;
	            } else {
	                break;
	            }
	        }
	    };

	    var isFree = function (x, y, size) {
	        return getPoints(x, y, size).every(function (point) {
	            if (grid[point.y] && grid[point.y][point.x]) {
	                return false;
	            }
	            return true;
	        });
	    };

	    var result = {items:[], height:0};
			images.forEach(function (image) {
        var x = 0;
        var y = sY;

        var size = Utils.getImageTileSize(image);

        while (true) {
            if (!grid[y] || isFree(x, y, size)) {
                reserveGrid(x, y, size, image.id);

                result.items.push({
                	left: x * gridSize + gutter/2,
                	top: y * gridSize + gutter/2,
                	width: gridSize * size.w - gutter,
                	height: gridSize * size.h - gutter,
                	image:image,
                	href: Utils.getGalleryLink(image.link)
                });

                break;
            } else {
                x++;
                if (x + size.w > gridWidth) {
                    x = 0;
                    y++;
                }
            }
        }
    	});

			result.height = grid.length * gridSize;
			return result;
		},

		/**
		 * get image tile size
		 * @param  {object} image
		 * @return {object}       image tile size {w:int, h:int} in grid
		 */
		getImageTileSize:function(image){
			var size = {w:1,h:1};

			if ( image.width > image.height * 1.5 ){
				size.w = 2;
			} else if (image.height > image.width * 1.5){
				size.h = 2;
			} else if (image.width > 2048 && image.height > 2048){
				size.w = 2;
				size.h = 2;
			}

			return size;
		},


		/**
		 * get cursor position of touch or mouse event
		 * @param  {event} evt
		 * @return {object}     {x: int, y: int}
		 */
		getCursor:function(evt){
			if (evt.touches.length > 0){
				return {x:evt.touches[0].pageX, y:evt.touches[0].pageY, timeStamp:evt.timeStamp};
			} else {
				return {x:evt.pageX, y:evt.pageY, timeStamp:evt.timeStamp};
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
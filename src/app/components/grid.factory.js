'use strict';

angular.module('imgurapp')

	.factory('Grid', function(){
		/**
		 * generate grid of images
		 * (C) joni
		 * @param  {array} images
		 * @return {array}        list of images
		 */
		function Grid(items, gridSize, gutter){
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

	    var result = {
	    	items:[],
	    	height:0
	    };

			_.forEach(items, function (item) {
        var x = 0;
        var y = sY;
        var size = item.size;

        while (true) {
          if (!grid[y] || isFree(x, y, size)) {
            reserveGrid(x, y, size, item.id);

            result.items.push({
            	left: x * gridSize + gutter/2,
            	top: y * gridSize + gutter/2,
            	width: gridSize * size.w - gutter,
            	height: gridSize * size.h - gutter,
            	item:item
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
		}

		return Grid;
	});
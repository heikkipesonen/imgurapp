'use strict';

angular.module('imgurapp')


	.directive('comment', function(){
		return {
			restrict:'A',
			scope:{
				comment:'='
			},
			template:
			'<div class="comment">'+
				'<div class="comment-author" ng-bind="::comment.author"></div>'+
				'<div class="comment-comment" ng-bind="::comment.comment"></div>'+
				'<div class="comment-children" ng-bind="::\'replies: \'+comment.children.length"></div>'+
			'</div>'
		};
	});
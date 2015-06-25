'use strict';

angular.module('imgurapp')


	.directive('comment', function(){
		return {
			restrict:'A',
			scope:{
				comment:'='
			},
			controller:function CommentController($scope){
				$scope.childVisible = false;
				$scope.showChildren =function (){
					$scope.childVisible = !$scope.childVisible;
				};
			},
			template:
			'<div class="comment" ng-click="showChildren()">'+
				'<div class="comment-author" ng-bind="::comment.author"></div>'+
				'<div class="comment-comment" ng-bind="::comment.comment"></div>'+
				'<div class="comment-children" ng-bind="::\'replies: \'+comment.children.length"></div>'+

				'<div class="comment-child" ng-if="childVisible" ng-repeat="(childIndex, child) in comment.children track by childIndex">'+
					'<div class="comment-author" ng-bind="::child.author"></div>'+
					'<div class="comment-comment" ng-bind="::child.comment"></div>'+
					'<div class="comment-children" ng-bind="::\'replies: \'+child.children.length"></div>'+
				'</div>'+
			'</div>'
		};
	});
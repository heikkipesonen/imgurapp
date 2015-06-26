'use strict';

angular.module('imgurapp')


	.directive('comments', function(){
		return {
			restrict:'A',
			scope:{
				comments:'=',
				limit:'='
			},
			controller:function CommentController($scope, $rootScope, $timeout){
				var disabled = false;
				var timer = false;
				function disableTap(){
					disabled = true;
					if (timer){
						$timeout.cancel(timer);
					}

					timer = $timeout(function(){
						disabled = false;
					},500);
				}

				$scope.showChildren =function (comment, evt){
					if (disabled) return;

					evt.stopPropagation();

					comment.childrenVisible = !comment.childrenVisible;
					if (comment.childrenVisible){
						$rootScope.$broadcast('scroll.toAnimated', evt.srcElement);
					}

					disableTap();
				};

			},
			template:
			'<div class="comment" ng-click="showChildren(comment, $event)" ng-repeat="(commentIndex, comment) in comments | limitTo : limit track by commentIndex">'+
				'<div class="comment-author" ng-bind="::comment.author"></div>'+
				'<div class="comment-comment" ng-bind="::comment.comment"></div>'+
				'<div class="comment-children-count" ng-bind="::\'replies: \'+comment.children.length"></div>'+
				'<div class="comment-children-pointer" ng-show="comment.childrenVisible && comment.children.length > 0"></div>'+
				'<div class="comment comment-child comment-animate" ng-click="showChildren($event)" ng-if="comment.childrenVisible" ng-repeat="(childIndex, child) in comment.children track by childIndex">'+
					'<div class="comment-author" ng-bind="::child.author"></div>'+
					'<div class="comment-comment" ng-bind="::child.comment"></div>'+
					'<div class="comment-children-count" ng-bind="::\'replies: \'+child.children.length"></div>'+
				'</div>'+
			'</div>'
		};
	});
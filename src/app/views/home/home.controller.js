(function(){
'use strict';

	function HomeController($scope, $timeout, galleries, galleryGroups){
		this.galleryGroups = galleryGroups;

		/**
		 * toggle gallery group active state
		 * close all other groups
		 * @param  {object} galleryGroup
		 * @return {void}
		 */
		this.toggleGalleryGroup = function(galleryGroup, evt){
			if (!galleryGroup.active){
				var openGroups = _.filter(this.galleryGroups, {'active':true});
				_.forEach(openGroups, function(group){
					group.active = false;
				});
			}


			// $scope.$broadcast('scroll.hold', evt.srcElement);

			$timeout(function(){
				// $scope.$broadcast('scroll.release');
				// $timeout(function(){
					$scope.$broadcast('scroll.toAnimated', evt.srcElement.offsetTop);
				// },100)
			}, 500);

			// $scope.$broadcast('scrollto', evt.srcElement.offsetTop);
			galleryGroup.active = !galleryGroup.active;
		};
	}

	angular.module('imgurapp')
	  .controller('HomeController',HomeController);

})();

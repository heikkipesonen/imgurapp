(function(){
'use strict';

	function HomeController($scope, $timeout, galleries, galleryGroups, Utils, $state){
		this.galleryGroups = galleryGroups;


		/**
		 * goto gallery page when item is clicked
		 * @param  {[type]} gallery [description]
		 * @return {[type]}         [description]
		 */
		this.gotoGallery = function(gallery){
			var state = Utils.getGalleryState(gallery);
			$state.go(state.name, state.params);
		};

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


			// $scope.$broadcast('scrollto', evt.srcElement.offsetTop);
			galleryGroup.active = !galleryGroup.active;

			if (galleryGroup.active){
				$timeout(function(){
					// $scope.$broadcast('scroll.release');
					// $timeout(function(){
						$scope.$broadcast('scroll.toAnimated', evt.srcElement.offsetTop);
					// },100)
				}, 500);
			}
		};
	}

	angular.module('imgurapp')
	  .controller('HomeController',HomeController);

})();

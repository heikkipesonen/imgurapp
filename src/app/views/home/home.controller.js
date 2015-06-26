(function(){
'use strict';

	function HomeController($scope, $timeout, galleries, galleryGroups, Utils, $state, appConfig){
		var homeController = this;
		this.galleryGroups = galleryGroups;
		this.actionDisabled = false;
		this.config = appConfig;

		this.forms = {};
		this.formdata = {
			feedback:{
				name:'',
				email:'',
				message:''
			}
		};

		this.disableAction = function(){
			this.actionDisabled = true;
			$timeout(function(){
				homeController.actionDisabled = false;
			},500);
		};

		/**
		 * goto gallery page when item is clicked
		 * @param  {[type]} gallery [description]
		 * @return {[type]}         [description]
		 */
		this.gotoGallery = function(gallery){
			if (this.actionDisabled) return;

			var state = Utils.getGalleryState(gallery);
			$state.go(state.name, state.params);
			this.disableAction();
		};

		/**
		 * toggle gallery group active state
		 * close all other groups
		 * @param  {object} galleryGroup
		 * @return {void}
		 */
		this.toggleGalleryGroup = function(galleryGroup, evt){
			if (this.actionDisabled) return;

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
				$scope.$broadcast('scroll.toAnimated', evt.srcElement);
			}
			this.disableAction();
		};
	}

	angular.module('imgurapp')
	  .controller('HomeController',HomeController);

})();

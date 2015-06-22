(function(){
'use strict';

function HomeController(galleries, Utils, transitionManager){
	this.galleries = _.map(galleries, function(gallery){
		return {
			url:gallery,
			href:Utils.getGalleryLink(gallery)
		}
	});
}

angular.module('imgurapp')
  .controller('HomeController',HomeController);

})();

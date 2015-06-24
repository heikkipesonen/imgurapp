(function(){
'use strict';

function HomeController(galleries, galleryGroups, Utils){
	this.galleryGroups = galleryGroups;
}

angular.module('imgurapp')
  .controller('HomeController',HomeController);

})();

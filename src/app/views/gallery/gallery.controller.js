(function(){

'use strict';

	function GalleryController(appConfig, $http){
		$http.get(appConfig.api +'/gallery').then(function(response){
			console.log(response);
			return response.data.data;
		});
	}

	GalleryController.prototype = {
		get:function($http){

		}
	}

	angular.module('imgurapp')
	  .controller('GalleryController', GalleryController);
})();

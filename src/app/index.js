'use strict';

angular.module('imgurapp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router'])

	.constant('appConfig', {
		api:'https://api.imgur.com/3',
		client_id: 'b84e33b2ff595f6',
		client_secret: '8ebf546494d982fdd5b9c4155218ab1ddd06cbbd'
	})

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, appConfig) {

  	$httpProvider.defaults.headers.common.Authorization = 'Client-ID '+ appConfig.client_id;

    $stateProvider

    	// .state('root',{
    	// 	abstract:true,
    	// 	template:'<ui-view></ui-view>'
    	// })

    	// .state('root.home', {
    	// 	url:'/',
    	// 	templateUrl:'app/views/home/home.view.html',
    	// 	controller:'HomeController',
    	// 	controllerAs:'Home'
    	// })

      .state('gallery', {
      	url:'/gallery{galleryId:(?:/[^/]+)?}',
      	resolve:{
      		galleryImages:function($http, $stateParams){
	      		return $http.get(appConfig.api +'/gallery').then(function(response){
							return response.data.data;
						});
      		}
      	},
        templateUrl: 'app/views/gallery/gallery.view.html',
        controller: 'GalleryController',
        controllerAs: 'Gallery',
      })

      .state('gallery.image', {
      	url:'/:imageId',
      	resolve:{
      		image:function(galleryImages, $stateParams, $q){
      			var d = $q.defer();
      			var img = _.find(galleryImages, {id: $stateParams.imageId});
      			console.log(img);

      			if (img){
      				d.resolve(img);
      			} else {
      				d.reject(false);
      			}

      			return d.promise;
      		},

      		nextImage:function(galleryImages, image){
      			var index = galleryImages.indexOf(image)+1;
      					index = index === galleryImages.length ? 0 : index;
      			return galleryImages[index];
      		},

      		prevImage:function(galleryImages, image){
      			var index = galleryImages.indexOf(image)-1;
      					index = index < 0 ? galleryImages.length-1 : index;

      			return galleryImages[index];
      		}
      	},
      	controller:'ImageController',
      	controllerAs:'Image',
      	templateUrl: 'app/views/image/image.view.html',
      })
      ;


  })


  .run(function(){
  	document.body.addEventListener('touchmove', function(evt){
  		evt.preventDefault();
  	})
  })
;

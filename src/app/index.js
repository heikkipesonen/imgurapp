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

      .state('gallery', {
        url:'/:type/:galleryId',
      	resolve:{
          /**
           * fetch images from gallery
           * @param  {[type]} $http        [description]
           * @param  {[type]} $stateParams [description]
           * @return {promise}             gallery images
           */
      		galleryImages:function($http, $stateParams){
	      		return $http.get(appConfig.api +'/gallery/'+$stateParams.type + '/' + $stateParams.galleryId).then(function(response){
              return response.data.data;
						});
      		}
      	},
        controller: 'GalleryController',
        controllerAs: 'Gallery',
        templateUrl: 'app/views/gallery/gallery.view.html',
        abstract:true
      })

      .state('gallery.page', {
      	url:'/gallery',
      	resolve:{
          /**
           * just to wait until images are resolved
           * @param  {[type]} galleryImages
           * @return {[type]}
           */
      		images:function(galleryImages){
      			return galleryImages;
      		}
      	},
        templateUrl: 'app/views/gallery/page/gallery.page.view.html',
      })

      .state('gallery.image', {
      	url:'/:imageId',
      	resolve:{
          /**
           * find image from galleryImages
           * @param  {[type]} galleryImages [description]
           * @param  {[type]} $stateParams  [description]
           * @param  {[type]} $q            [description]
           * @return {[type]}               [description]
           */
      		image:function(galleryImages, $stateParams, $q){
            var img = _.find(galleryImages, {id: $stateParams.imageId});
            var d = $q.defer();

            if (img){
              d.resolve(img);
            } else {
              d.reject(false);
            }

            return d.promise;
      		},

          /**
           * next image
           * @param  {[type]} galleryImages [description]
           * @param  {[type]} image         [description]
           * @return {[type]}               [description]
           */
      		nextImage:function(galleryImages, image){
      			var index = galleryImages.indexOf(image)+1;
      					index = index === galleryImages.length ? 0 : index;

      			return galleryImages[index];
      		},

          /**
           * prev image
           * @param  {[type]} galleryImages [description]
           * @param  {[type]} image         [description]
           * @return {[type]}               [description]
           */
      		prevImage:function(galleryImages, image){
      			var index = galleryImages.indexOf(image)-1;
      					index = index < 0 ? galleryImages.length-1 : index;

      			return galleryImages[index];
      		}
      	},
      	controller:'ImageController',
      	controllerAs:'Image',
      	templateUrl: 'app/views/gallery/image/image.view.html',
      })
      ;

      $urlRouterProvider.otherwise('/hot/viral/gallery');
  })


  .run(function(){
  	document.body.addEventListener('touchmove', function(evt){
  		evt.preventDefault();
  	})
  })
;

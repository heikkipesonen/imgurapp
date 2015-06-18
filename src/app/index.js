'use strict';

angular.module('imgurapp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router'])

	.constant('appConfig', {
		api:'https://api.imgur.com/3',
		client_id: 'b84e33b2ff595f6',
		client_secret: '8ebf546494d982fdd5b9c4155218ab1ddd06cbbd'
	})


  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, appConfig, imgurApiProvider) {
    imgurApiProvider.client_id = appConfig.client_id;
    imgurApiProvider.client_secret = appConfig.client_secret;

    $stateProvider
      .state('root', {
        abstract:true,
        resolve:{
          galleries:function(imgurApi, $q){
            var d = $q.defer();
            imgurApi.getGalleries().then(function(success){
              d.resolve(success);
              return success;
            }, function(){
              d.resolve([]);
            });

            return d.promise;
          }
        },
        templateUrl:'app/views/root/root.view.html'
      })

      .state('root.home',{
        url:'/',
        templateUrl:'app/views/home/home.view.html',
        controller:'HomeController',
        controllerAs:'Home'
      })

      .state('root.gallery', {
        url:'/:type/:galleryId',
        resolve:{
          /**
           * fetch images from gallery
           * @param  {[type]} $http        [description]
           * @param  {[type]} $stateParams [description]
           * @return {promise}             gallery images
           */
      		galleryImages:function($stateParams, imgurApi){
            return imgurApi.getGallery($stateParams.type, $stateParams.galleryId);
      		},

          nextGallery:function($stateParams, galleries, Utils){
            return Utils.nextItem( galleries, $stateParams.type + '/' + $stateParams.galleryId );
          },

          prevGallery:function($stateParams, galleries, Utils){
            return Utils.prevItem( galleries, $stateParams.type + '/' + $stateParams.galleryId );
          }
      	},
        templateUrl: 'app/views/gallery/gallery.view.html',
        abstract:true,
        controller: 'GalleryPageController',
        controllerAs: 'Gallery',
      })

      .state('root.gallery.page', {
        url:'/gallery',
        resolve:{
          /**
           * just to wait until images and galleries are resolved
           * @param  {[type]} galleryImages
           * @return {[type]}
           */
          images:function(galleryImages){
            return galleryImages;
          }
        },
        controller: 'GalleryPageController',
        controllerAs: 'GalleryPage',
        templateUrl: 'app/views/gallery/page/gallery.page.view.html',
      })

      .state('root.gallery.image', {
      	url:'/:imageId',
      	resolve:{
          /**
           * find image from galleryImages
           * @param  {[type]} galleryImages [description]
           * @param  {[type]} $stateParams  [description]
           * @param  {[type]} $q            [description]
           * @return {[type]}               [description]
           */
      		image:function(galleryImages, $stateParams){
            return _.find(galleryImages, {id: $stateParams.imageId});
      		},

          /**
           * next image
           * @param  {[type]} galleryImages [description]
           * @param  {[type]} image         [description]
           * @return {[type]}               [description]
           */
      		nextImage:function(galleryImages, image, Utils){
            return Utils.nextItem(galleryImages, image);
      		},

          /**
           * prev image
           * @param  {[type]} galleryImages [description]
           * @param  {[type]} image         [description]
           * @return {[type]}               [description]
           */
      		prevImage:function(galleryImages, image, Utils){
            return Utils.prevItem(galleryImages, image);
      		}
      	},
      	controller:'ImageController',
      	controllerAs:'Image',
      	templateUrl: 'app/views/gallery/image/image.view.html',
      })

    .state('root.gallery.album', {
      url:'/:imageId/:albumImageId',
      controller:'ImageAlbumController',
      controllerAs:'Album',
      templateUrl: 'app/views/gallery/image/album/image.album.view.html',

      resolve:{
        album:function($stateParams, galleryImages, imgurApi){
          var inCache = _.find(galleryImages, { id:$stateParams.imageId });
            console.log(inCache)

          if (!inCache.images){
            return imgurApi.getAlbum($stateParams.imageId);
          } else {
            return inCache;
          }
        },

        albumImage:function($stateParams, album){
          return _.find(album.images, {id : $stateParams.albumImageId });
        },

        nextAlbumImage:function(album, albumImage, Utils){
          return Utils.nextItem(album.images, albumImage);
        },

        prevAlbumImage:function(album, albumImage, Utils){
          return Utils.prevItem(album.images, albumImage);
        }
      }
    })
      ;

      $urlRouterProvider.otherwise('/');
  })


  .run(function(transitionManager, $rootScope){
    transitionManager.setAnimationDirection();

    var current = null;
    $rootScope.$on('$stateChangeSuccess', function(evt, state){
      current = state.name;
    });

    $rootScope.$on('$stateChangeStart', function(evt, newstate){
      if (current === 'root.gallery.page' && newstate.name === 'root.gallery.image'){
        transitionManager.setAnimationDirection('down');
      }
    });

  	document.body.addEventListener('touchmove', function(evt){
  		evt.preventDefault();
  	});
  })
;

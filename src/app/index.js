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
          /**
           * get gallery listing from api (not really, but could...)
           * @param  {object} imgurApi
           * @param  {object} $q
           * @return {object}         promise
           */
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
        controller:'RootController',
        controllerAs:'Root',
        templateUrl:'app/views/root/root.view.html'
      })

      // home view
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
        controller: 'GalleryController',
        controllerAs: 'Gallery',
      })

      .state('root.gallery.page', {
        url:'/gallery',
        resolve:{
          /**
           * wait until images and galleries are resolved
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
      controller:'AlbumImageController',
      controllerAs:'Album',
      templateUrl: 'app/views/gallery/image/album/image.album.view.html',

      resolve:{
        /**
         * get album of images (image which has many images)
         * @param  {[type]} $stateParams  [description]
         * @param  {[type]} galleryImages [description]
         * @param  {[type]} imgurApi      [description]
         * @return {[type]}               [description]
         */
        album:function($stateParams, galleryImages, imgurApi){
          // check if album is found from already loaded elements,
          // if not, try http get it from imgur api
          var inCache = _.find(galleryImages, { id:$stateParams.imageId });

          if (!inCache.images){
            return imgurApi.getAlbum($stateParams.imageId);
          } else {
            return inCache;
          }
        },

        /**
         * one image of album
         * @param  {[type]} $stateParams [description]
         * @param  {[type]} album        [description]
         * @return {[type]}              [description]
         */
        albumImage:function($stateParams, album){
          return _.find(album.images, {id : $stateParams.albumImageId });
        },

        /**
         * next image of album according to current one
         * @param  {[type]} album      [description]
         * @param  {[type]} albumImage [description]
         * @param  {[type]} Utils      [description]
         * @return {[type]}            [description]
         */
        nextAlbumImage:function(album, albumImage, Utils){
          return Utils.nextItem(album.images, albumImage);
        },

        /**
         * last image of album according to current one
         * @param  {[type]} album      [description]
         * @param  {[type]} albumImage [description]
         * @param  {[type]} Utils      [description]
         * @return {[type]}            [description]
         */
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
      // when on gallery page, set animation to downward
      if (current === 'root.gallery.page' && newstate.name === 'root.gallery.image'){
        transitionManager.setAnimationDirection('down');
      } else if (current === 'root.gallery.image' && newstate.name === 'root.gallery.album'){
        transitionManager.setAnimationDirection('down');
      }  else if (current === 'root.home'){
        // on home view, the only direction is down
        transitionManager.setAnimationDirection('down');
      }
    });

  	document.body.addEventListener('touchmove', function(evt){
  		evt.preventDefault();
  	});
  })
;

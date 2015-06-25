'use strict';

angular.module('imgurapp')

  .config(function ($stateProvider, $urlRouterProvider) {

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
          },

          /**
           * group galleries by name start letter
           * @param  {array} galleries list of galleries
           * @param  {object} Utils
           * @return {object}           grouped list of galleries
           */
          galleryGroups:function(galleries){

            return _.chain(galleries)

              .uniq()

              .groupBy(function(gallery){
                if (/.(\/)[0-9]+/.test(gallery)){
                  return '1-10';
                } else {
                  return gallery.slice(gallery.lastIndexOf('/')).substring(1,2).toLowerCase();
                }
              })

              .map(function(group, groupIndex){
                return {
                  name:groupIndex,
                  items:group
                };
              })

              .sortBy('name').value();
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
        url:'/:type/{galleryId:[a-zA-Z0-9]+}/{galleryPage:[0-9]+}',
        resolve:{


          /**
           * precalculate thumbnail sizes (for uniformity)
           * @return {int} thumbnail width
           */
          thumbnailSize:function(){
            return window.innerWidth/4;
          },

          imageSize:function(){
            return window.innerWidth;
          },
          /**
           * fetch images from gallery
           * @param  {[type]} $http        [description]
           * @param  {[type]} $stateParams [description]
           * @return {promise}             gallery images
           */
      		galleryImages:function($stateParams, imgurApi){
            return imgurApi.getGallery($stateParams.type, $stateParams.galleryId, $stateParams.galleryPage);
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
           * parse thumbnails from images
           * @param  {[type]} galleryImages
           * @return {[type]}
           */
          thumbnails:function(galleryImages, thumbnailSize, $state, $stateParams, Utils){
            /**
             * make thumbnails (add 's' on image file name)
             */
            var thumbnails = galleryImages.map(function(image){
              image.href = $state.href('root.gallery.image', {
                type: $stateParams.type,
                galleryId: $stateParams.galleryId,
                galleryPage: $stateParams.galleryPage,
                imageId: image.id
              });

              return image;
            });

            /**
             * compose grid of images
             */
            return Utils.makeGrid(thumbnails, thumbnailSize, 10);
          },
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
      		image:function(galleryImages, $state, $stateParams, imgurApi, thumbnailSize, Utils){
            var image =  _.find(galleryImages, {id: $stateParams.imageId});

            if (image.is_album){
              return imgurApi.getAlbum(image.id).then(function(album){

                var images = album.images.map(function(albumImage){

                  albumImage.href = $state.href('root.gallery.album', {
                    type: $stateParams.type,
                    galleryId: $stateParams.galleryId,
                    imageId: image.id,
                    albumImageId: albumImage.id
                  });

                  return albumImage;
                });

                image.grid = Utils.makeGrid(images, thumbnailSize, 10);
                return image;

                  // set down as available drag direction to reveal
                  // gallery contents as images
                  // directionManager.set('down', {
                  //   name:'root.gallery.album',
                  //   params:{
                  //     galleryId:$stateParams.galleryId,
                  //     imageId:$stateParams.imageId,
                  //     albumImageId:_.first(imageController.grid.items).id
                  //   }
                  // });
                });
            } else {
              return image;
            }
      		},

          /**
           * get position of image in array
           * @param  {array} galleryImages
           * @param  {object} image         image object in array
           * @return {object}               {currentIndex: int, max: images.length}
           */
          imagePosition:function(galleryImages, image){
            return {
              index:galleryImages.indexOf(image),
              count:galleryImages.length
            };
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
         * get position of image in album
         * @param  {array} album images
         * @param  {object} image         image object in array
         * @return {object}               {currentIndex: int, max: images.length}
         */
        albumImagePosition:function(album, albumImage){
          return {
            index:album.images.indexOf(albumImage),
            count:album.images.length
          };
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
  });
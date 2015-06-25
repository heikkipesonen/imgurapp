  'use strict';

  angular.module('imgurapp')

    .provider('imageSize', function(){
      this.devicePixelRatio = window.devicePixelRatio;
      this.gutter = 10;
      this.thumbnailRatio = 0.25;
      this.imageRatio = 1;

      this.$get = function(imgurApi){
        function ImageSizeService(options){
          this._gutter = options.gutter;
          this._devicePixelRatio = options.devicePixelRatio;
          this._thumbnailRatio = options.thumbnailRatio;
          this._imageRatio = options.imageRatio;
        }

        ImageSizeService.prototype = {

          thumbnail:function(){
            return window.innerWidth * this._thumbnailRatio;
          },

          image:function(){
            return window.innerWidth * this._imageRatio;
          },

          gutter:function(){
            return this._gutter;
          },

          getResizedImage:function(image, minimumSize){
            var imageSize = null;
            if (!image.animated){
              // if image has outragous aspect ratio
              var thumbnail = imgurApi.findThumbnail(minimumSize);

              if (image.height > image.width){
                var actualWidth = thumbnail.size / image.height * image.width;
                var minimumRatio = thumbnail.size / actualWidth;

                if (image.width / (image.height / 1024) >= minimumSize){
                  imageSize = imgurApi.findThumbnail(image.width * minimumRatio);
                }
              } else {
                imageSize = thumbnail;
              }
            }

            return imageSize;
          }
        };

        return new ImageSizeService(this);
      };

    });
  'use strict';

  angular.module('imgurapp')

    .provider('imgurApi', function(){
      this.url = 'https://api.imgur.com/3';
      this.client_id = null;
      this.client_secret = null;

      this.$get = function($http){
        function ImgurApiService(options){
          this.options = angular.extend({}, options);
        }

        ImgurApiService.prototype = {

          /**
           * get data over http with imgur auth headers
           * @param  {string} url
           * @param  {string} method
           * @return {Promise}
           */
          _get:function(url, method){
            return $http({
              headers:{
                Authorization: 'Client-ID '+ this.options.client_id
              },
              method:method || 'GET',
              url:url,
            });
          },


          /**
           * get gallery images
           * @param  {string} type    type of gallery ex. 'r'
           * @param  {string} gallery gallery name
           * @return {Promise}
           */
          getGallery:function(type, gallery){
            return this._get(this.options.url +'/gallery/'+type + '/' + gallery).then(function(response){
              return response.data.data;
            });
          },

          /**
           * get image album by id
           * @param  {string} id album id
           * @return {Promise}
           */
          getAlbum:function(id){
            return this._get(this.options.url +'/album/'+id).then(function(response){
              return response.data.data;
            });
          }
        };


        /**
         * return service
         * @type {object}
         */
        return new ImgurApiService({
          url:this.url,
          client_id:this.client_id,
          client_secret:this.client_secret
        });
      };
    });
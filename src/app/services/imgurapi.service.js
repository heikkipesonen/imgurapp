  'use strict';
/**
 *
Thumbnail Suffix  Thumbnail Name  Thumbnail Size  Keeps Image Proportions
s Small Square  90x90 No
b Big Square  160x160 No
t Small Thumbnail 160x160 Yes
m Medium Thumbnail  320x320 Yes
l Large Thumbnail 640x640 Yes
h Huge Thumbnail  1024x1024 Yes
 */
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
           * imgur thumbnail sizes
           * @type {Array}
           */
          thumbnails:[
            {name:'s', size:90},
            {name:'b', size:160},
            {name:'m', size:320, proportions:true},
            {name:'l', size:640, proportions:true},
            {name:'h', size:1024, proportions:true}
          ],

          /**
           * find thumbnail for size
           * @param  {int} size container size
           * @return {object}      nearest thumbnail size
           */
          findThumbnail:function(size){
            return this.thumbnails.reduce(function (prev, curr) {
              return (Math.abs(curr.size - size) < Math.abs(prev.size - size) ? curr : prev);
            });
          },

          /**
           * find thumbnail that is at least size width
           * @param  {int} size
           * @return {object}      thumbnail
           */
          findLargerThumbnail:function(size){
            var result = this.findThumbnail(size);

            for (var i in this.thumbnails){
              if (this.thumbnails[i].size >= size){
                result = this.thumbnails[i];
                break;
              }
            }

            return result;
          },

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
              url:this.options.url + '/' + url,
              cache:true
            });
          },

          /**
           * get topics list from imgur
           * @return {Promise}
           */
          getTopics:function(){
            return $http.get('/app/resources/topics.json').then(function(response){
              return response.data;
            });
          },

          /**
           * get gallery images
           * @param  {string} type    type of gallery ex. 'r'
           * @param  {string} gallery gallery name
           * @return {Promise}
           */
          getGallery:function(type, gallery, page){
            if (page === undefined) page = '';
            return this._get('gallery/'+type + '/' + gallery + '/'+ page).then(function(response){
              return response.data.data;
            });
          },

          /**
           * get topic listing from api
           * @param  {string} id   topic id
           * @param  {int} page page number
           * @return {Promise}
           */
          getTopic:function(id, page){
            if (page === undefined) page = '';

            return this._get('/topics/'+id+'/'+page).then(function(response){
              return response.data.data;
            });
          },

          /**
           * get image album by id
           * @param  {string} id album id
           * @return {Promise}
           */
          getAlbum:function(id){
            return this._get('album/'+id).then(function(response){
              return response.data.data;
            });
          },

          /**
           * get comments for album / image
           * @param  {string} imageId
           * @return {promise}         hideous array of comments
           */
          getComments:function(imageId){
            return this._get('gallery/'+imageId+'/comments').then(function(response){
              return response.data.data;
            });
          },


          /**
           * get image thumbnail url from image url
           * adds thumbnail size character to the end of the filename
           * @param  {string} url  image url
           * @param  {string} size imgur thumbnail size
           * @return {string}      thumbnail url
           */
          getThumbnail:function(url, size){
            if (url.indexOf('h.gif') > -1){
              url = url.replace('h.gif', '.gif');
            }
            return url.replace(/(\w+)(\.\w+)$/i, '$1'+size+'$2');
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
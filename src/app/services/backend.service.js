(function(){
  'use strict';

  angular.module('imgurapp')

  	.provider('backendService', function(){
      this.url = '';

      this.$get = function($http){

        function BackendService(options){
          this.options = options;
          console.log(this);
        }

        BackendService.prototype = {
          _send:function(request){
            request.headers = {
              'Content-Type':'application/json'
            };

            request.url = this.options.url + request.url;

            return $http(request).then(function(response){
              return response.data;
            });
          },

          post:function(endpoint, data){
            var request = {
              method:'POST',
              url:endpoint,
              data:data
            };

            return this._send(request);
          }
        };

        return new BackendService({url:this.url});
      };
  	});
})();
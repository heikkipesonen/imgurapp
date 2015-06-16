'use strict';

angular.module('imgurapp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router'])

	.constant('appConfig', {
		api:'https://api.imgur.com/3',
		client_id: 'b84e33b2ff595f6',
		client_secret: '8ebf546494d982fdd5b9c4155218ab1ddd06cbbd'
	})

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, appConfig) {

  	console.log($httpProvider);
  	$httpProvider.defaults.headers.common.Authorization = 'Client-ID '+ appConfig.client_id;

    $stateProvider
      .state('gallery', {
        url: '/',
        templateUrl: 'app/views/gallery/gallery.view.html',
        controller: 'GalleryController',
        controllerAs: 'Gallery'
      });

    $urlRouterProvider.otherwise('/');
  })
;

'use strict';

angular.module('imgurapp', ['angular-loading-bar','ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router'])

	.constant('appConfig', {
		api:'https://api.imgur.com/3',
		client_id: 'b84e33b2ff595f6',
		client_secret: '8ebf546494d982fdd5b9c4155218ab1ddd06cbbd',
    gridItemSize: window.innerWidth / 4,
    gridItemGutter: 10
	})

  .config(function(imgurApiProvider, appConfig) {
    imgurApiProvider.client_id = appConfig.client_id;
    imgurApiProvider.client_secret = appConfig.client_secret;
  })

  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  })

  .run(function(transitionManager, $rootScope, $timeout){
    transitionManager.setAnimationDirection();
    $rootScope.showLoadScreen = false;

    var timer = null;
    var current = null;

    $rootScope.$on('$stateChangeSuccess', function(evt, state){
      current = state.name;
      $rootScope.showLoadScreen = false;

      $timeout.cancel(timer);
    });

    $rootScope.$on('$stateChangeStart', function(evt, newstate){
      timer = $timeout(function(){
        $rootScope.showLoadScreen = true;
      },0);
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

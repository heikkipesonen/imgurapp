'use strict';

angular.module('imgurapp', ['angular-loading-bar','ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router'])

	.constant('appConfig', {
		api:'https://api.imgur.com/3',
		client_id: 'b84e33b2ff595f6',
		client_secret: '8ebf546494d982fdd5b9c4155218ab1ddd06cbbd',
    resource_url:'app/resources',
    backend_url:'http://192.168.0.10:8080',
    nsfwFilter:true
	})

  .config(function(imgurApiProvider, appConfig) {
    imgurApiProvider.client_id = appConfig.client_id;
    imgurApiProvider.client_secret = appConfig.client_secret;
  })

  .config(function(backendServiceProvider, appConfig){
    backendServiceProvider.url = appConfig.backend_url;
  })

  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  })

  .service('stateHistory', function(){
    this.lastResolved = null;

    this.setLastResolved = function(state, params){
      this.lastResolved = {
        name:state.name,
        params:angular.extend({}, params)
      };
    };

  })


  /**
   * application init
   */
  .run(function(transitionManager, $rootScope, $timeout, $stateParams, stateHistory){

    // set initial transitions
    transitionManager.setAnimationDirection();
    $rootScope.showLoadScreen = false;

    // load screen timeout
    var timer = null;
    // current state for setting the correct animation direction
    var current = null;

    // listen on state change
    $rootScope.$on('$stateChangeSuccess', function(evt, state){
      current = state.name;
      // set as last correctly resolved state
      // if errors occur, we can go back to this
      stateHistory.setLastResolved(state, $stateParams);

      // hide loadscreen and cancel loading screen timer
      $rootScope.showLoadScreen = false;
      $timeout.cancel(timer);
    });


    $rootScope.$on('$stateChangeError', function(evt, state){
      console.log(evt,state, stateHistory);
      $rootScope.showLoadScreen = false;
      $timeout.cancel(timer);
    });

    $rootScope.$on('$stateChangeStart', function(evt, newstate){

      // initialize timer
      // if loading takes longer than 200ms, something is done in the view
      timer = $timeout(function(){
        $rootScope.showLoadScreen = true;
      },200);

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


    // prevent ios body scrolling
  	document.body.addEventListener('touchmove', function(evt){
  		evt.preventDefault();
  	});
  })
;

(function(){
'use strict';

	function FeedbackController(directionManager){
		this.form = {};
		this.model = {
			name:'',
			email:'',
			message:''
		};

		this.submit = function(form){

		};


		directionManager.set('up',{
			name :'root.home',
			params:{}
		});
	}

	angular.module('imgurapp')
	  .controller('FeedbackController',FeedbackController);

})();

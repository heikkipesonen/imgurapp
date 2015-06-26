(function(){
'use strict';

	function FeedbackController(directionManager, backendService){
		this.form = {};
		this.model = {
			name:'',
			email:'',
			message:''
		};

		this.submit = function(){
			return backendService.post('/feedback', this.model).then(function(response){
				console.log(response);
			});
		};


		directionManager.set('up',{
			name :'root.home',
			params:{}
		});
	}

	angular.module('imgurapp')
	  .controller('FeedbackController',FeedbackController);

})();

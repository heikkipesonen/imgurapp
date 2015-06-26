(function(){
'use strict';

	function FeedbackController(directionManager, backendService){
		var feedbackController = this;
		this.form = {};
		this.model = {
			name:'',
			email:'',
			message:''
		};

		this.busy = false;
		this.message = '';

		this.submit = function(){
			this.busy = true;
			return backendService.post('/feedback', this.model).then(function(response){
				if (response.ok === true){
					feedbackController.message = 'Message delivered.';
				} else {
					feedbackController.message = 'Message was not delivered, for some reason :/';
				}
			},function(){
				feedbackController.message = 'Message was not delivered, check your inputs (email, etc) :|';
			}).finally(function(){
				feedbackController.busy = false;
			});
		};


		directionManager.set('left',{
			name :'root.home',
			params:{}
		});

		directionManager.set('up');
		directionManager.set('down');
		directionManager.set('right');
	}

	angular.module('imgurapp')
	  .controller('FeedbackController',FeedbackController);

})();

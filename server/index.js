var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var _ = require('lodash');
var email = require('./email/email.js');
var env = require('./conf.js');
var S = require('string');
var validator = require('validator');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', function(req, res){
  res.end(JSON.stringify({ok:true}));
});

app.post('/feedback', function(req, res){
	var data = req.body;
	if ( validator.isEmail(data.email) && validator.isAlphanumeric(data.name)){


		var emailData = {
			email: validator.normalizeEmail( data.email ),
			subject:'imgur app Feedback',
			message: data.name + '\n\n from:' + data.email + '\n\n\n' + 'message:'+'\n\n' + validator.escape( data.message )
		};

		email.send(emailData, function(response){
			res.status(200);
			res.end(JSON.stringify(response));
		});

	} else {
		res.status(400);
		res.end(JSON.stringify({ ok: false }));
	}

	// email.send({koira:1}, function(response){
	// 	res.end(JSON.stringify(response))
	// });
})

http.listen(8080, function(){
  console.log('juu kuule');
});
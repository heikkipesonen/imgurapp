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
	email.feedback(req, res);
});

http.listen(process.env.PORT, function(){
  console.log('juu kuule');
});
var nodemailer = require('nodemailer');
var env = require('../conf.js');
var validator = require('validator');

module.exports = {
	send:function (data, callback){
		var transporter = nodemailer.createTransport({
		    service: 'gmail',
		    auth: {
		        user: env.email,
		        pass: env.password
		    }
		});

		transporter.sendMail({
		    from: data.email,
		    to: env.email,
		    subject: data.subject,
		    text: data.message,
		    replyTo: data.email
		}, function(error){
			callback({
				ok: error ? false : true,
				valid: true
			});
		});
	},

	feedback:function(req, res){
		var data = req.body;

		if ( validator.isEmail(data.email) &&
			validator.isAscii(data.name) &&
			validator.isAscii(data.message)){


			var emailData = {
				email: validator.normalizeEmail( data.email ),
				subject:'IMGURAPP Feedback',
				message: data.name + ' <' + data.email + '>\n\n\n' + 'message:'+'\n\n' + validator.escape( data.message )
			};

console.log(emailData);

			this.send(emailData, function(response, error){
				res.status(response.ok ? 200 : 400);
				res.end(JSON.stringify(response));
console.log(error);
			});

		} else {
			res.status(400);
			res.end(JSON.stringify({ ok: false , valid:false}));
		}
	}
};
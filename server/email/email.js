var nodemailer = require('nodemailer');
var env = require('../conf.js');

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
		}, function(error, info){
			callback({
				ok: error ? false : true,
				messageId: info.messageId
			});
		});
	}
};
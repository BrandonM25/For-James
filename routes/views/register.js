var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'register';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.userRegistered = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'register' }, function (next) {

        

		var newEnquiry = new User.model();
        var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, password, phone',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
                console.log(err)
                req.flash('failure', err);
				locals.validationErrors = err.errors;
			} else {
                console.log('Success');
                req.flash('success', 'Account Created');
				locals.userRegistered = true;
			}
			next();
		});
	});

	view.render('register');
};

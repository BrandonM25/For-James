var keystone = require('keystone');

exports = module.exports = function(req, res) {

    console.log('we in this')
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'signout';
	
	keystone.session.signout(req, res, function() {
        console.log('redirect now');
		res.redirect('/');
    });
	
};
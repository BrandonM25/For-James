var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'store';
	locals.filters = {
		product: req.params.product,
	};
	locals.data = {
		products: [],
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Product').model.findOne({
			state: 'published',
			slug: locals.filters.product,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.product = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Product').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.products = results;
			next(err);
		});

	});

	view.on('post', function(next) {
		var q = keystone.list('User').model.updateOne().where('state', 'published').populate('cart');
	})

	// Render the view
	view.render('product');
};
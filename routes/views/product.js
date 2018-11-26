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
	locals.formData = req.body || {};

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

	view.on('post', { action: 'products' }, function (next) {
		console.log(req);
		// var resRedirect = res;
		// var productId = req.params.id;
		// Product.model.findById(productId)
		// 	.exec(function (err, product) {
		// 		console.log(`Product ${productId} added to cart`);
		// 		req.session.User.cart.push(product);
		// 	})
		// 	.then(function (arg) {
		// 		resRedirect.redirect("/products");
		// 	})

	})

	// Render the view
	view.render('product');
};
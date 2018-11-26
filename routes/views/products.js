var keystone = require('keystone');
var async = require('async');
var Product = keystone.list("Product");

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'store';
	locals.filters = {
		productcategory: req.params.productcategory,
	};
	locals.data = {
		products: [],
		productcategories: [],
	};
	locals.formData = req.body || {};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('ProductCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.productcategories = results;

			// Load the counts for each category
			async.each(locals.data.productcategories, function (productcategory, next) {

				keystone.list('Product').model.count().where('productcategories').in([productcategory.id]).exec(function (err, count) {
					productcategory.productCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.productcategory) {
			keystone.list('ProductCategory').model.findOne({ key: locals.filters.productcategory }).exec(function (err, result) {
				locals.data.productcategory = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.productcategory) {
			q.where('productcategories').in([locals.data.productcategory]);
		}

		q.exec(function (err, results) {
			locals.data.products = results;
			next(err);
		});
	});

	view.on('post', function (next) {

		var resRedirect = res;
		var productId = req.body.id;
		Product.model.findById(productId)
			.exec(function (err, product) {
				console.log(`Product ${productId} added to cart`);
				req.session.cart.push(product);
			})
			.then(function (arg) {
				resRedirect.redirect("/products");
			})

	})

	// Render the view
	view.render('products');
};
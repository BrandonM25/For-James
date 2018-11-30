var keystone = require('keystone');
var async = require('async');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.filters = {
		category: req.params.category,
		productcategory: req.params.productcategory,
	};

	locals.data = {
		posts: [],
		categories: [],
		products: [],
		productcategories: [],
	};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 3,
			maxPages: 1,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Load all productcategories
	view.on('init', function (next) {

		keystone.list('ProductCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.productcategories = results;

			// Load the counts for each product category
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

	// Load the current product category filter
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

	// Load the products
	view.on('init', function (next) {

		var q = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 4,
			maxPages: 1,
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

	// Render the view
	view.render('index');
};

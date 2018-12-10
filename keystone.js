// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'iJnApparel',
	'brand': 'iJnApparel',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/PNG file - Copy.ico',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cloudinary config': 'cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo',
	'cookie secret': '9a6fd8708ff20f788b62c463a9a393099f1f5ecd4beccf8cf71a86d963f3014ab5b99329921b23cad57d093299717cc287cceab06ea7b57f971e639302df4b53',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	galleries: 'galleries',
	enquiries: 'enquiries',
	products: ['products', 'product-categories'],
	users: 'users',
});

// keystone.set('signin logo', '/public/images/PNG file - Copy.png', 200, 250);
// keystone.set('favicon', '/public/images/PNG file - Copy.png');

// Start Keystone to connect to your database and initialise the web server


keystone.start();

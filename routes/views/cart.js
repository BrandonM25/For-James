var keystone = require('keystone');

exports = module.exports = function (req, res) {
    
    var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
    locals.section = 'cart';
    
    var cartContents = {};
    req.session.cart.forEach((item) => {
        if (!cartContents[item._id]) {
            cartContents[item._id] = {
                id: item._id,
                name: item.title,
                price: item.price,
                quanity: 1,
                imageUrl: item.image.url,
            };
        } else {
            cartContents[item._id].quanity++;
        }
    });

    res.locals.cartContents = cartContents;

    view.render('cart');
};
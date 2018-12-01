var keystone = require('keystone');

exports = module.exports = function (req, res) {
    
    var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
    locals.section = 'cart';

    var cartContents = {};
    req.session.cart.forEach((item) => {
        if (!cartContents[item.product._id]) {
            cartContents[item.product._id] = {
                id: item.product._id,
                name: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                imageUrl: item.product.image.url,
            };
        } else {
            cartContents[item.product._id].quantity++;
        }
    });

    res.locals.cartContents = cartContents;

    view.on('post', function (next) {

        var resRedirect = res;
        console.log(req.body)
        console.log(req.body.id)
        var productId = req.body.id;
	    for (var i = 0; i < req.session.cart.length; i++) {
            if (req.session.cart[i].product._id === productId) {
                req.session.cart.splice(i, 1);
                break;
		    }
        }
        
        resRedirect.redirect("/cart");

	})

    view.render('cart');
};
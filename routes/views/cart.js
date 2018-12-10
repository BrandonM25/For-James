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
                //priceString: item.product.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
                quantity: item.quantity,
                imageUrl: item.product.image.url,
            };
        } else {
            cartContents[item.product._id].quantity++;
        }
    });

    //Remove item from cart
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
    
    // //Cart total
    // var totalPrice = 0;
	// req.session.cart.forEach((item) => {
	// 	totalPrice += item.product.price;
	// });
	// res.locals.totalPrice = totalPrice;
	// res.locals.totalPriceString = totalPrice.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

    view.render('cart');
};
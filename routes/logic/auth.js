var express = require('express');
var router = express.Router();
var User = require('../../models/User');
var keystone = require('keystone');

router.post('/signin123', function (req, res) {

    if (!req.body.email || !req.body.password) return res.json({ success: false });

    keystone.list('User').model.findOne({ email: req.body.email }).exec(function (err, user) {

        if (err || !user) {
            return res.json({
                success: false,
                session: false,
                message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
            });
        }

        keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function (user) {

            return res.json({
                success: true,
                session: true,
                date: new Date().getTime(),
                userId: user.id
            });

        }, function (err) {

            return res.json({
                success: true,
                session: false,
                message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
            });

        });

    });
})

router.all('/signout123', function (req, res) {
    keystone.session.signout(req, res, function () {
        res.json({ 'signedout': true });
        res.redirect('/index');
    });
});

router.all('/auth*', function checkAuth(req, res, next) {
    // you could check user permissions here too
    if (req.user) return next();
    return  res.status(403).json({ 'error': 'no access' });
  })

  module.exports = router;
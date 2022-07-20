var express = require('express');
var router = express.Router();
var conn = require('../lib/dbConnections');

//renders longin view
router.get('/', function(req, res, next) {
    // res.render('../views/home', {my_session: req.session});
    res.render('../views/publicViews/home', {my_session: req.session});

});

router.get('/residential', function(req, res, next) {
    // res.render('../views/home', {my_session: req.session});
    res.render('../views/publicViews/residential', {my_session: req.session});

});
module.exports = router;
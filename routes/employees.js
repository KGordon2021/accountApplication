var express = require('express');
var router = express.Router();
var conn = require('../lib/dbConnections');

//renders employees view
router.get('/employees', function(req, res, next) {
    res.render('../views/employeeViews/main.ejs',  {my_session: req.session});
});


router.get('/employees/allplayslip/:id', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    if(req.session.loggedin == true) {
    conn.query("SELECT pc.*, es.* FROM accounts_app.pay_cycles pc,  accounts_app.employee_salaries es WHERE pc.id = es.pay_cycle && es.employee_id =" + req.session.emp_id, function(err,row){
    if(err) {
        console.log(err)
    } else {
        res.render('../views/employeeViews/allpay_cycles', 
        {
            allpayslips: row, 
            my_session: req.session
        });
    }
    });
    } else {
        res.redirect('/login')
    }
    
});

router.get('/employees/viewplayslip/:id', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    if(req.session.loggedin == true) {
        conn.query("SELECT es.*, pc.* FROM employee_salaries es, pay_cycles pc WHERE es.pay_cycle = pc.id && es.id =" + req.params.id, function(err,row){
        if(err) {
            console.log(err)
        } else {
            res.render('../views/employeeViews/currentpay_cycle', 
            {
                currentpayslip: row, 
                my_session: req.session
            });
        }
        });
        } else {
            res.redirect('/login')
        }
        
    });

module.exports = router;

var express = require('express');
var router = express.Router();
var conn = require('../lib/dbConnections');

//renders supervisor's view
router.get('/supervisor', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 2) {
     conn.query("SELECT  ee.*, al.user_id FROM  accounts_app.employees ee, accounts_app.allusers al WHERE al.user_id =" + req.session.emp_id + " && al.emp_dep = ee.emply_dep", function(err,row){
    if(err) {
        console.log(err);
    } else {
        res.render('../views/supervisorsViews/viewdepemplyee', {alldepEmployees:row, my_session: req.session});
    }
    });

        } else {
            res.redirect('/login')
        }
});

//renders supervisor's post view for selected employee
router.get('/supervisor/create/:id', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 2) {
     conn.query("SELECT ee.*, dp.*, pr.* FROM  accounts_app.employees ee, accounts_app.departments dp, accounts_app.pay_rates pr WHERE ee.emply_dep = dp.dp_id && ee.payscale = pr.id && emply_id =" + req.params.id, function(err,row){
    if(err) {
        console.log(err);
    } else {
        res.render('../views/supervisorsViews/addHoursWorked', {employeeinfo: row, my_session: req.session});
    }
    });

        } else {
            res.redirect('/login')
        }
});

// Create post Router to send new employee salary info to the database 

router.post('/supervisor/create/addinfo/:ot_rate/:reg_rate', function(req, res, next) { //route has to be declared once
    
    if(req.session.loggedin == true && req.session.user_Auth == 2) {
        
        var regularsal = parseInt(req.params.reg_rate) * parseInt(req.body.rg_wk);
        var overtimesal = parseInt(req.params.ot_rate) * parseInt(req.body.ot_wk); 
        var gross_sal = regularsal + overtimesal;

        let data = {   pay_cycle: req.body.pay_cycle, 
                        employee_id: req.body.emp_id, 
                        ot_worked: parseInt(req.body.ot_wk), 
                        reg_hours_worked: parseInt(req.body.rg_wk), 
                        total_ot: overtimesal,
                        total_regsal: regularsal,
                        gross_pay: gross_sal,
                    };
    
            let sqlQuery = "INSERT INTO employee_salaries SET ?";
            let vQuery = conn.query(sqlQuery, data,(err, results) => {
            if(err) {
                console.log(err);
            }
                else {
                    res.redirect('/supervisor');
                }
            });
        } else {
            res.redirect('/login')
        }
         
});


//renders supervisor's add new employee view

router.get('/supervisor/addemployee', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 2) {

        res.render('../views/supervisorsViews/addnewemployee', {my_session: req.session});
        } else {
            res.redirect('/login')
        }
});

// Create post Router to send new employeeto the database 

router.post('/supervisor/add/new_emply', (req, res) => {
    if(req.session.loggedin == true && req.session.user_Auth == 2) {

          let data = {   emply_id: req.body.emp_id, 
                         emply_dep: req.session.emp_dep, 
                         emply_fn: req.body.emp_fn, 
                         emply_ln: req.body.emp_ln, 
                         payscale: req.body.employ_pos,
                        
                    };
    
            let sqlQuery = "INSERT INTO employees SET ?";
            let vQuery = conn.query(sqlQuery, data,(err, results) => {
            if(err) {
                console.log(err);
            }
                else {
                    res.redirect('/supervisor');
                }
            });
        } else {
            res.redirect('/login')
        }
})


//renders supervisor's edit employee information view
router.get('/supervisor/empedit/:id', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 2) {
     conn.query("SELECT  * FROM  employees WHERE emply_id =" + req.params.id, function(err,row){
    if(err) {
        console.log(err);
    } else {
        res.render('../views/supervisorsViews/editemployeeinfo', 
        {
        emplyInfo:row, 
        my_session: req.session
        });
    }
    });

        } else {
            res.redirect('/login')
        }
});

// Create post Router to send updated employee info to the database 

router.post('/supervisor/empUpdate', (req, res, next) => {

    const data = {
        emply_id: req.body.emp_id, 
        emply_dep: req.session.emp_dep, 
        emply_fn: req.body.emp_fn, 
        emply_ln: req.body.emp_ln, 
        payscale: req.body.employ_pos,
    }

    conn.query('UPDATE employees SET ? WHERE emply_id = ' + req.body.emp_id, data, (err, row) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/supervisor')
        }
    })
    
})
       


//renders supervisor's leave days view

router.get('/supervisor/addleaveday', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 2) {

        res.render('../views/supervisorsViews/leavedays', {my_session: req.session});
        } else {
            res.redirect('/login')
        }
});

// Create post Router to send new employeeto the database 

router.post('/supervisor/add/leavedays', (req, res) => {
    if(req.session.loggedin == true && req.session.user_Auth == 2) {

        let data = {   employee_id: req.body.emp_id, 
                        leave_day: req.body.lv_days, 
                        details: req.body.dets, 
                        days_applied: req.body.nums_dt, 
                        date_from: req.body.dt_fr,
                        date_to: req.body.dt_to,
                    
                    };
    
            let sqlQuery = "INSERT INTO leave_days SET ?";
            let vQuery = conn.query(sqlQuery, data,(err, results) => {
            if(err) {
                console.log(err);
            }
                else {
                    res.redirect('/supervisor');
                }
            });
        } else {
            res.redirect('/login')
        }
})


module.exports = router;
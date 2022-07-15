var express = require('express');
var router = express.Router();
var conn = require('../lib/dbConnections');

//renders accounts officer's view
router.get('/AccountOff', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 1) {
     conn.query("SELECT  * From pay_cycles", function(err,row){
    if(err) {
        console.log(err);
    } else {
        res.render('../views/accountantViews/allpaycycles', {allpaycycles:row, my_session: req.session});
        
    }
    });

        } else {
            res.redirect('/login')
        }
});

// renders all employes along with their departments
router.get('/AccountOff/allemps', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 1) {
     conn.query("SELECT  ee.*, dp.dp_nm From accounts_app.employees ee, accounts_app.departments dp WHERE ee.emply_dep = dp.dp_id", function(err,row){
    if(err) {
        console.log(err);
    } else {
        res.render('../views/accountantViews/allexistingemployees', {allemployees:row, my_session: req.session});
        
    }
    });

        } else {
            res.redirect('/login')
        }
});

//renders accounts officer's view for all employees within the selected pay cycle
router.get('/AccountOff/viewpaycycle/:id', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 1) {
     conn.query("SELECT ee.*, es.* FROM  employees ee, employee_salaries es WHERE es.employee_id = ee.emply_id && es.pay_cycle =" + req.params.id, function(err,row){
    if(err) {
        console.log(err);
    } else {
        res.render('../views/accountantViews/allemployeespc', {pcinfo: row, my_session: req.session});
    }
    });

        } else {
            res.redirect('/login')
        }
});


//renders accounts officer post view for selected employee
router.get('/AccountOff/viewpaycycle/selected/:id', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 1) {
     conn.query("SELECT ee.*, dp.*, pr.* FROM  accounts_app.employees ee, accounts_app.departments dp, accounts_app.pay_rates pr WHERE  ee.payscale = pr.id && emply_id =" + req.params.id, function(err,row){
    if(err) {
        console.log(err);
    } else {
        res.render('../views/accountantViews/accountsaddHours', {employeeInfo: row, my_session: req.session});
    }
    });

        } else {
            res.redirect('/login')
        }
});

// Create post Router to send new employee salary info to the database 

router.post('/accounts/emphour/new/:ot_rate/:reg_rate', function(req, res, next) { //route has to be declared once
    
    if(req.session.loggedin == true && req.session.user_Auth == 1) {
        
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
                    res.redirect('/AccountOff');
                }
            });
        } else {
            res.redirect('/login')
        }
         
});

//route to render generate payslip view
router.get('/accounts/viewpayslip/:pc/:empid/:id', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    if(req.session.loggedin == true && req.session.user_Auth == 1) {
        conn.query("SELECT es.*, ee.*, pr.* FROM accounts_app.employee_salaries es, accounts_app.employees ee, accounts_app.pay_rates pr WHERE  ee.emply_id =" + req.params.empid + " && es.pay_cycle = " + req.params.pc + " && es.id  = " + req.params. id + " && ee.payscale = pr.id group by es.id", function(err,row){
        if(err) {
            console.log(err)
        } else {
            res.render('../views/accountantViews/generatepayslip', 
            {
                viewpayslip: row, 
                my_session: req.session
            });
        }
        });
        } else {
            res.redirect('/login')
        }
        
    });


//renders supervisor's edit employee information view
router.get('/accounts/editpayslip/:pc/:empid/:id', function(req, res, next) {
    if(req.session.loggedin == true && req.session.user_Auth == 1) {
        conn.query("SELECT es.*, ee.*, pr.* FROM accounts_app.employee_salaries es, accounts_app.employees ee, accounts_app.pay_rates pr WHERE  ee.emply_id =" + req.params.empid + " && es.pay_cycle = " + req.params.pc + " && es.id  = " + req.params. id + " && ee.payscale = pr.id group by es.id", function(err,row){
        if(err) {
            console.log(err)
        } else {
            res.render('../views/accountantViews/accountseditsalary', 
            {
                editsal: row, 
                my_session: req.session
            });
        }
        // console.log(editsal)
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
       


module.exports = router;
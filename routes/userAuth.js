var express = require('express');
var router = express.Router();
var conn = require('../lib/dbConnections');
var bcrypt = require('bcrypt')

//renders login view
router.get('/login', function(req, res, next) {
    res.render('../views/publicViews/login', {my_session: req.session});
});

//authenticates user 
router.post('/user/login', async (req, res, next) =>{
    var email = req.body.usr_email;
    var password = req.body.pswrd;

    conn.query('SELECT * FROM allusers WHERE user_email = ?', [email], function(error, rows, fields){ //santitizes and cleanses your code
        if (rows[0].user_pswd) {
            bcrypt.compare(password, rows[0].user_pswd, function(err, result) {
             if(result) {
                req.session.loggedin = true;
                req.session.first_Nm = rows[0].user_fn;
                req.session.first_lm = rows[0].user_ln;
                req.session.emp_id = rows[0].user_id;
                req.session.user_Auth = rows[0].user_Auth;
                req.session.emp_dep = rows[0].emp_dep;
                res.redirect('/employees');
               return 
             }
             else {
                req.flash('error', "Incorrect Login Credentials");
                res.redirect('/login');
                return
             }
            
    });   
}
})
})

//=====================Registration Page Details======================//
//renders Registration view
router.get('/register', function(req, res, next) {
//   if(req.session.loggedin == true && req.session.tc_id == 1001) {
    res.render('../views/publicViews/register', {my_session: req.session});
//   } else {
//       res.redirect('/login')
//   }

});


router.post('/register/new_user' , async(req, res) => {
//   if(req.session.loggedin == true && req.session.tc_id == 1001) {
var value = req.body.pswrd;
const salt =  await bcrypt.genSalt(12); // the sync alternative const salt = bcrypt.genSaltSync(12) where no await function is used
value =  await bcrypt.hash(value, salt) // similarly the sync alternative value = bcrypt.hash(value, salt)

let data = {   user_id: req.body.emp_id,
                user_fn: req.body.f_nm,
                user_ln: req.body.l_nm,
                user_email: req.body.usr_email,
                user_Auth: 0,
                user_pswd: value
            };

    let sqlQuery = "INSERT INTO allusers SET ?";
    
    let vQuery = conn.query(sqlQuery, data,(err, results) => {
    if(err) {
      console.log(err); 
    } else {
    //    res.send(JSONResponse(results));
       res.redirect('/login');
    }
    });
//   } else {
//       res.redirect('/login')
//   }

}); 



//to log out user

router.get('/logout', function(req, res){
    // req.flash('success', "Enter your Login Credentials"); // logically not applicable after the user logs in
    res.redirect('/login');
    req.session.destroy();
})

module.exports = router;
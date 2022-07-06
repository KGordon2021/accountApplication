var express = require('express');
var router = express.Router();
var conn = require('../lib/dbConnections');
var bcrypt = require('bcrypt')

//renders login view
router.get('/login', function(req, res, next) {
    res.render('../views/publicViews/login', {my_session: req.session});
});

//authenticates user 
// router.post('/user/login', async (req, res, next) =>{
//     var email = req.body.usr_email;
//     var password = req.body.pswrd;

//     conn.query('SELECT * FROM user WHERE email_address = ?', [email], function(error, rows, fields){ //santitizes and cleanses your code
//         if (rows[0].password) {
//             bcrypt.compare(req.body.pswrd, rows[0].password, function(err, result) {
//             //  console.log('>>>>>> ', password)
//             //  console.log('>>>>>> ', rows[0].user_pswd)
//              if(result) {
//                 req.session.loggedin = true;
//                 req.session.first_Nm = rows[0].user_fm;
//                 req.session.tc_id = rows[0].company_id
//                 res.redirect('/dc_allreqs');
//                return 
//              }
//              else {
//                 req.flash('error', "Incorrect Login Credentials");
//                 res.redirect('/login');
//                 return
//              }
            
//     });   
// }
// })
// })

//=====================Registration Page Details======================//
//renders Registration view
router.get('/register', function(req, res, next) {
//   if(req.session.loggedin == true && req.session.tc_id == 1001) {
    res.render('../views/publicViews/register', {my_session: req.session});
//   } else {
//       res.redirect('/login')
//   }

});

// router.get('/register/new_tc', function(req, res, next) {
//   if(req.session.loggedin == true && req.session.tc_id == 1001) {
//   res.render('../views/publicViews/affiliates_crud/add_affiliate', {my_session: req.session});
// } else {
//   res.redirect('/login')
// }

// });

// router.post('/register/new_tc_prof' , (req, res) => {
//   if(req.session.loggedin == true && req.session.tc_id == 1001) {
//   var voucher = Date.now().toString().slice(-5);
//   let data = {    company_id: req.body.c_Id, 
//                   company_name: req.body.c_nm,
//                   company_rate: req.body.c_rt,
//                    };

//   let sqlQuery = "INSERT INTO tour_companies_profile SET ?";
//   let vQuery = conn.query(sqlQuery, data,(err, results) => {
//   if(err) {
//       console.log(err);
//   }
//       else {
//           res.redirect('/login');
//       }
//   });
// } else {
//   res.redirect('/login')
// }


//   });

// router.post('/register/new_user' , async(req, res) => {
//   if(req.session.loggedin == true && req.session.tc_id == 1001) {
// var value = req.body.pswrd;
// const salt =  await bcrypt.genSalt(12); // the sync alternative const salt = bcrypt.genSaltSync(12) where no await function is used
// value =  await bcrypt.hash(value, salt) // similarly the sync alternative value = bcrypt.hash(value, salt)

// let data = {    user_id: req.body.u_ID, 
//                 user_fm: req.body.f_nm,
//                 user_ln: req.body.l_nm,
//                 email_address: req.body.usr_email,
//                 company_id: req.body.comp_Id,
//                 password: value
//             };

//     let sqlQuery = "INSERT INTO user SET ?";
    
//     let vQuery = conn.query(sqlQuery, data,(err, results) => {
//     if(err) {
//       console.log(err); 
//     } else {
//     //    res.send(JSONResponse(results));
//        res.redirect('/login');
//     }
//     });
//   } else {
//       res.redirect('/login')
//   }

// }); 



//to log out user

router.get('/logout', function(req, res){
    // req.flash('success', "Enter your Login Credentials"); // logically not applicable after the user logs in
    res.redirect('/login');
    req.session.destroy();
})

module.exports = router;
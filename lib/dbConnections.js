var mysql = require('mysql');
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kristine@2021",
    database: "accounts_app"
});

conn.connect((err)=> {
    if(!err)
        console.log('Connected to database Successfully... Fighting!!!');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });

    module.exports = conn;
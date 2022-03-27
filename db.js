const mysql = require("mysql");

var conn = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tracker'
};

var connection = mysql.createConnection(conn);
connection.connect((err) => {
    if(!err){
        console.log("Connected to database");
    return;
    }
    else{
        console.log("Db connection failed");
    }
});

module.exports = { connection }
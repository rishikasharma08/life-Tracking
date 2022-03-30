const mysql = require("mysql");

var conn = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'life_tracking'
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
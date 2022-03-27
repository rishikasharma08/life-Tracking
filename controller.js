const express = require("express");
const app = express();
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const conn = require('./db');
const { connect } = require("./routes");
const connection = conn.connection;
const bcrypt = require('bcrypt');

//to insert data in user profile
const add_user = (req, res) => {

    let data = {
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        address: req.body.address,
        dob: req.body.dob,
        gender: req.body.gender,
        password: req.body.password,
        user_token: Date.now(),
        created_at: req.body.created_at
    }

    bcrypt.hash(data.password, 10, function (err, hash) {

        let user = `INSERT INTO user_profile (name, email, contact, address, dob, gender, password,user_token) VALUES (?,?,?,?,?,?,?,?)`;
        let ifUser = connection.query(user, [data.name, data.email, data.contact, data.address, data.dob, data.gender, hash, data.user_token]);
        if (ifUser) {
            res.send("Inserted");
        }
        else {
            res.send("Error");
        }
    });
}

// user login
const login_user = (req, res) => {

    let data = {
        email: req.body.email,
        password: req.body.password,
    }
    
    bcrypt.compare( data.password, hash, function(err, result) {
        // result == true
        //  let user = `SELECT * from user_profile where email = "${data.email}" and password = "${data.password}"`;
   

    let user = `SELECT * from user_profile where email = "${data.email}" and password = "${data.password}"`; {
        if(!data.email || !data.password){
            return `Please enter email and password `, res.status(422);
        }
        else{
        let ifUser = connection.query(user, (err, rows)=>{
            if(err){
                // res.send(err,"USer does not exist");
                console.log(err, "User does not exist");
            }
            else{
                res.send(rows);
            }
        }}
        });
});
}

module.exports = { add_user, login_user }
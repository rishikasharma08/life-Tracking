const express = require("express");
const app = express();
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const conn = require('./db');
const connection = conn.connection;
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    const hash = bcrypt.hashSync(data.password, saltRounds);
    // bcrypt.hash(data.password, 10, function (err, hash) {
    let user = `INSERT INTO user_profile (name, email, contact, address, dob, gender, password,user_token) VALUES (?,?,?,?,?,?,?,?)`;
    let ifUser = connection.query(user, [data.name, data.email, data.contact, data.address, data.dob, data.gender, hash, data.user_token]);
    if (ifUser) {
        res.send("Signed up Successfully");
    }
    else {
        res.send("Something went wrong");
    }
    // });
}

// user login
const login_user = (req, res) => {
    let data = {
        email: req.body.email,
        password: req.body.password,
    }
    let user = `SELECT email, password from user_profile where email = "${data.email}"`;
    let ifUser = connection.query(user, (err, rows) => {
        if (err) {
            console.log(err, "User does not exist");
        }
        else {
            console.log(bcrypt.hashSync(data.password, saltRounds));
            console.log(rows[0].password);
            console.log(bcrypt.compareSync(data.password, rows[0].password));
            res.send(rows[0].password);
        }
    });
}


//health  data
const healthData = (req, res) => {
    let data = {
        user_id : req.body.user_id,
        profession: req.body.profession,
        job_type: req.body.job_type,
        job_hours: req.body.job_hours,
        age: req.body.age,
        weight: req.body.weight,
        height: req.body.height,
        health_goal: req.body.health_goal,
    }

    let health = `INSERT INTO user_health ( user_id, profession, job_type, job_hours, age, weight, height, health_goal) VALUES (?,?,?,?,?,?,?,?)`;

    let ifHealth =  connection.query(health, [data.user_id, data.profession, data.job_type ,data.job_hours, data.age, data.weight, data.height, data.health_goal]);

    if(ifHealth){
        res.send("Successfully Inserted");
    }
    else{
        res.send("ERROR");
    }

}

module.exports = { add_user, login_user, healthData }
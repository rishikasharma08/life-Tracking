const express = require("express");
const app = express();
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const conn = require('./db');
const connection = conn.connection;
const md5 = require('md5');

//to insert data in user profile
const add_user = (req, res) => {

    let data = {
        name: req.body.name,
        email: req.body.email && req.body.email.length > 0 ? req.body.email : "N/A",
        contact: req.body.contact,
        address: req.body.address,
        dob: req.body.dob,
        gender: req.body.gender,
        password: req.body.password,
        user_token: Date.now(),
    }
    const password = md5(data.password);
    let findOld = `SELECT * FROM user_profile WHERE email = "${data.email}"`;
    connection.query(findOld, (err, rows) => {
        if (err) {
            res.send({ msg: "Something went wrong", error: 1 });
        }
        else if (rows.length > 0) {
            res.send({ msg: "The user email already exists. Kindly use the new email for registration", error: 1 });
        }
        else {
            let user = `INSERT INTO user_profile (name, email, contact, address, dob, gender, password,user_token) VALUES (?,?,?,?,?,?,?,?)`;
            let ifUser = connection.query(user, [data.name, data.email, data.contact, data.address, data.dob, data.gender, password, data.user_token], function (err, response) {

                if (err) {
                    res.send({ msg: "Something went wrong", error: 1 });
                }
                else {
                    res.send({ msg: "Signed up Successfully", error: 0, user_id: response.insertId });
                }
            });
        }
    })
}

//user info
const user_info = (req, res) => {
    let user = `SELECT user_id, email, name, contact, gender, avtar_id, user_token, yesHealth, yesWealth, user_score FROM user_profile where user_id = ${req.body.id}`;
    let ifUser = connection.query(user, (err, rows) => {
        if (rows && rows.length > 0) {
            res.send({ msg: "User Info Fetched successfully", error: 0, data: rows });
        }
        else {
            res.send({ msg: "The user does not exist", error: 1 });
        }
    });
}

// user login
const login_user = (req, res) => {

    let data = {
        email: req.body.email,
        password: req.body.password,
    }
    let user = `SELECT user_id, email, user_token, password from user_profile where email = "${data.email}"`;
    let ifUser = connection.query(user, (err, rows) => {
        if (rows && rows.length > 0) {
            if (rows[0].password === md5(data.password)) {
                res.send({ msg: "Logged In successfully", error: 0, user_id: rows[0].user_id });
            }
            else {
                res.send({ msg: "Login Email or Password does not match", error: 1 });
            }
        }
        else {
            res.send({ msg: "The user does not exist", error: 1 });
        }
    });
}


//health  data
const healthData = (req, res) => {
    let data = {
        user_id: req.body.user_id,
        profession: req.body.profession,
        job_type: req.body.job_type,
        job_hours: req.body.job_hours,
        age: req.body.age,
        weight: req.body.weight,
        height: req.body.height,
        health_goal: req.body.health_goal,
    }

    let already = `SELECT * FROM user_health WHERE user_id = ${data.user_id}`;
    connection.query(already, (err, rows) => {
        if (err) {
            res.send({ msg: "Something went wrong", error: 1 });
        }
        else if (rows.length > 0) {
            res.send({ msg: "Your health data already exists", error: 1 });
        }
        else {
            let health = `INSERT INTO user_health ( user_id, profession, job_type, job_hours, age, weight, height, health_goal) VALUES (?,?,?,?,?,?,?,?)`;

            let ifHealth = connection.query(health, [data.user_id, data.profession, data.job_type, data.job_hours, data.age, data.weight, data.height, data.health_goal]);

            if (ifHealth) {
                let updateUser = `UPDATE user_profile set yesHealth = 1 WHERE user_id = ${data.user_id}`;
                let ifUpdateUser = connection.query(updateUser, [], function (err, response) {
                    if (response.affectedRows > 0) {
                        res.send({ msg: "Your health data stored successfully", error: 0 });
                    }
                })
            }
            else {
                res.send({ msg: "Something went wrong", error: 1 });
            }
        }
    })
}

//sleep track data
const sleepData = (req, res) => {
    let data = {
        user_id: req.body.user_id,
        sleep_time: req.body.sleep_time,
        wakeup_time: req.body.wakeup_time
    }
    let sleep = `INSERT INTO sleep_track(user_id, sleep_time,wakeup_time) VALUES (?,?,?)`;
    let ifSleep = connection.query(sleep, [data.user_id, data.sleep_time, data.wakeup_time]);

    if (ifSleep) {
        res.send("Successfully Inserted");
    }
    else {
        res.send("ERROR");
    }
}

//water track data
const waterData = (req, res) => {
    let data = {
        user_id: req.body.user_id,
        water_times: req.body.water_times,

    }
    let water = `INSERT INTO water_track(user_id, water_times) VALUES (?,?)`;
    let ifWater = connection.query(water, [data.user_id, data.water_times]);

    if (ifWater) {
        res.send("Successfully Inserted");
    }
    else {
        res.send("ERROR");
    }
}

// diet track data
const user_diet = (req, res) => {
    let data = {
        user_id: req.body.user_id,
        calories: req.body.calories
    }
    let diet = `INSERT INTO water_track(user_id, required_calories) VALUES (?,?)`;
    let ifdiet = connection.query(diet, [data.user_id, data.calories], function (err, rows) {
        if (err) {
            res.send({ msg: err, error: 1 })
        }
        else if (rows[0].affectedRows.length > 0) {
            res.send({ msg: "Your record is saved successfully", error: 1 })
        }
    });

    if (ifWater) {
        res.send("Successfully Inserted");
    }
    else {
        res.send("ERROR");
    }
}

module.exports = { add_user, login_user, healthData, sleepData, waterData, user_info, user_diet }
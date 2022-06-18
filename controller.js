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
        email: req.body.email && req.body.email.length > 0 ? req.body.email : "N/A",  //?
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
            let ifUser = connection.query(user, [data.name, data.email, data.contact, data.address, data.dob, data.gender, password, data.user_token], (err, response) => {

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
                let required_cal = data.health_goal == 1 ? 1800 : data.health_goal == 2 ? 2400 : 2000;
                let first_diet = `INSERT INTO diet_tracking (user_id, required_meals, required_calories) VALUES (?,?,?)`;
                let if_first_diet = connection.query(first_diet, [data.user_id, 5, required_cal]);

                let first_sleep = `INSERT INTO sleep_track (user_id, required_sleep_hours) VALUES (?,?)`;
                let if_first_sleep = connection.query(first_sleep, [data.user_id, 8]);


                let first_water = `INSERT INTO water_track (user_id, required_glasses, required_water) VALUES (?, 10, 2500)`;
                let if_first_water = connection.query(first_water, [data.user_id, 8]);

                let updateUser = `UPDATE user_profile set yesHealth = 1 WHERE user_id = ${data.user_id}`;
                connection.query(updateUser, [], function (err, response) {
                    if (response.affectedRows > 0) {
                        res.send({ msg: "Your health data stored successfully", error: 0 });
                    }
                }
                )
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
        wakeup_time: req.body.wakeup_time,
        actual_sleep_hours: req.body.actual_sleep_hours
        
    }
    let sleep = `UPDATE sleep_track SET sleep_time = ?, wakeup_time = ?, actual_sleep_hours = ?  WHERE user_id = ?`;
    connection.query(sleep, [data.sleep_time, data.wakeup_time, data.actual_sleep_hours, data.user_id], (err, response) => {
        if (err) {
            console.log(err);
        }
        else if (response.affectedRows > 0) {
            res.send({ msg: "Your Sleep data stored successfully", error: 0 });
        }
        else {
            res.send({ msg: "Something went wrong", error: 1 });
        }
    });
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
        meal: req.body.meal,
        calories: req.body.calories
    }

    let diet = `INSERT INTO diet_today(user_id, meal, calories) VALUES (?,?,?)`;
    connection.query(diet, [data.user_id, data.meal, data.calories], function (err, rows) {
        if (err) {
            res.send({ msg: err, error: 1 })
        }
        else if (rows.affectedRows > 0) {
            let if_diet = `SELECT * FROM diet_tracking WHERE user_id = ${data.user_id}`;
            connection.query(if_diet, (e, rows) => {
                if (e) {
                    res.send({ msg: e, error: 1 })
                }
                else {
                    let diet_score = ((rows[0].intake_calories + data.calories) / rows[0].required_calories) * 10;

                    let update = `UPDATE diet_tracking SET intake_meals = ${rows[0].intake_meals + 1}, intake_calories = ${rows[0].intake_calories + data.calories}, diet_score = ${diet_score} WHERE user_id = ${data.user_id}`;

                    connection.query(update, (er, result) => {
                        if (result.affectedRows > 0) {
                            res.send({ msg: "Data updated successfuly", error: 0 })
                        }
                        else {
                            res.send({ msg: er, error: 1 })
                        }
                    })
                }
            })
        }
        else {
            res.send({ msg: "Something went wrong", error: 1 })
        }
    });
}

//user profile
const update_user = (req, res) => {
    let update = {
        user_id: req.body.user_id,
        email: req.body.email,
        name: req.body.name,
        contact: req.body.contact
    }
    let find = `SELECT * FROM user_profile WHERE email = "${update.email}"`;
    connection.query(find, (err, rows) => {
        if (err) {
            res.send({ msg: "Something went wrong", error: 1 });
        }
        else if (rows && rows.length > 0) {
            res.send({ msg: `Email already exists: ${update.email}`, error: 1 })
        }
        else {
            let extra_query = ``;
            if (update && update.email != null) {
                extra_query += ` email = "${update.email}"`
            }
            if (update && update.name != null) {
                extra_query += extra_query != "" ? extra_query = `, name = "${update.name}" ` : ` name = "${update.name}"`;
            }

            if (update && update.contact != null) {
                extra_query += extra_query != "" ? extra_query = `, contact = ${update.contact} ` : ` contact = ${update.contact}`;
            }

            let upUser = `UPDATE user_profile SET ${extra_query} WHERE user_id = ${update.user_id} ;`
            console.log(upUser);
            let ifUpdate = connection.query(upUser, [], function (err, response) {
                if (err) {
                    res.send({ msg: err, error: 1 })
                }
                else if (response.affectedRows > 0) {
                    res.send({ msg: "Your record is saved successfully", error: 0 })
                }
                else {
                    res.send({ msg: "No user exists with this id", error: 1 })
                }
            });
        }
    }
    )
}

const get_all_diet = (req, res) => {
    let user = `SELECT * FROM diet_today where user_id = ${req.body.user_id}`;
    let ifUser = connection.query(user, (err, rows) => {
        if (rows && rows.length > 0) {
            res.send({ msg: "Diet Data Fetched successfully", error: 0, data: rows });
        }
        else {
            res.send({ msg: "The Data does not exist", error: 1 });
        }
    });
}

const get_water_data = (req, res) => {
    let user = `SELECT * FROM water_track where user_id = ${req.body.user_id}`;
    let ifUser = connection.query(user, (err, rows) => {
        if (rows && rows.length > 0) {
            res.send({ msg: "Water Data Fetched successfully", error: 0, data: rows });
        }
        else {
            res.send({ msg: "The Data does not exist", error: 1 });
        }
    });
}

const update_water_data = (req, res) => {
    let water = `SELECT * FROM water_track WHERE user_id = ${req.body.user_id}`;
    connection.query(water, (err, rows) => {
        if (err) {
            res.send({ msg: err, error: 1 });
        }
        else if (rows && rows.length > 0) {

            let intake_glasses = rows[0].intake_glasses + 1;
            let intake_water = rows[0].intake_water + 250;
            let water_score = rows[0].required_water > intake_water ? intake_glasses : rows[0].water_score - 1;

            console.log(water_score, "water_score");

            let update = `UPDATE water_track SET intake_glasses = ?, intake_water = ?, water_score = ? WHERE user_id = ${req.body.user_id}`;

            let if_update = connection.query(update, [intake_glasses, intake_water, water_score], (e, resp) => {
                if (resp.affectedRows > 0) {
                    res.send({ msg: "Water Data updated Successfully", error: 0 });
                } else {
                    res.send({ msg: "Something went wrong", error: 1 });
                }
            })
        }
        else {
            res.send({ msg: "Water data does not exist", error: 1 });
        }
    })
}

const getWorkouts = (req, res) => {
    let workout = `SELECT * FROM workouts_available where work_id = ${req.body.work_id}`;
    connection.query(workout, (err, rows) => {
        if (rows && rows.length > 0) {
            let workout = JSON.parse(rows[0].workout);
            res.send({ msg: "Water Data Fetched successfully", error: 0, data: rows, workout });
        }
        else {
            res.send({ msg: "The Data does not exist", error: 1 });
        }
    });
}

const selectWorkout = (req, res) => {
    let workout = `UPDATE user_health SET workout_selected = ${req.body.work_id} WHERE user_id = ${req.body.user_id}`;
    connection.query(workout, (err, response) => {
        if (err) {
            res.send({ msg: err, error: 1, });
        }
        else if (response && response.affectedRows > 0) {
            res.send({ msg: "Workout Selected Successfully", error: 0, });
        }
        else {
            res.send({ msg: "Something went wrong", error: 1 });
        }
    });
}

const getselectWorkout = (req, res) => {
    let workout = `SELECT * FROM user_health WHERE user_id = ${req.body.user_id}`;
    connection.query(workout, (err, rows) => {
        if (err) {
            res.send({ msg: err, error: 1, });
        }
        else if (rows && rows.length > 0 && rows[0].workout_selected != null) {
            let if_already = `SELECT * FROM workout_track WHERE user_id = ${req.body.user_id} AND date_done >= '${req.body.today_date}' LIMIT 1`;
            connection.query(if_already, (err, data) => {
                if (data && data.length > 0) {
                    res.send({ msg: "You are done with your workout", error: 1 });
                }
                else {
                    let workout = `SELECT * FROM workouts_available where work_id = ${rows[0].workout_selected}`;
                    connection.query(workout, (err, new_rows) => {
                        if (new_rows && new_rows.length > 0) {
                            let workout = JSON.parse(new_rows[0].workout);
                            res.send({ msg: "Workout Data Fetched successfully", error: 0, data: new_rows, workout });
                        }
                        else {
                            res.send({ msg: "The Data does not exist", error: 1 });
                        }
                    });
                }
            })
        }
        else {
            res.send({ msg: "Something went wrong", error: 1 });
        }
    });
}


const DonewithtWorkout = (req, res) => {
    let workout = `INSERT INTO workout_track(user_id) VALUES (${req.body.user_id})`;
    connection.query(workout, (err, response) => {
        if (err) {
            res.send({ msg: err, error: 1, });
        }
        else if (response.insertId) {
            let query;
            let if_work = `SELECT * FROM exercise_track WHERE user_id = ${req.body.user_id}`;
            connection.query(if_work, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else if (data && data.length > 0) {
                    query = `UPDATE exercise_track SET muscle_score = ${data[0].muscle_score + 2} WHERE user_id = ${req.body.user_id}`;
                }
                else {
                    query = `INSERT INTO exercise_track (user_id, muscle_score) VALUES(${req.body.user_id}, 2)`;
                }
                connection.query(query, (error, resp) => {
                    if (error) {
                        console.log(error);
                    }
                    else if (resp.insertId) {
                        res.send({ msg: "Workout Done Successfully", error: 0, });
                    }
                    else {
                        res.send({ msg: "Something went wrong", error: 1 });
                    }
                })
            })
        }
        else {
            res.send({ msg: "Something went wrong", error: 1 });
        }
    });
}


const wealthData = (req, res) => {
    let query = `INSERT INTO user_wealth (total_Income, user_id) VALUES(${req.body.total_Income}, ${req.body.user_id})`;
    connection.query(query, (err, resp) => {
        if (err) {
            console.log(err);
        }
        else {
            let queery = `UPDATE user_profile SET yesWealth = 1 WHERE user_id = ${req.body.user_id}`;
            connection.query(queery, (err, response) => {
                if (err) {
                    res.send({ msg: err, error: 1, });
                }
                else if (response && response.affectedRows > 0) {
                    res.send({ msg: "Wealth Data Updated Successfully", error: 0 });
                }
                else {
                    res.send({ msg: "Something went wrong", error: 1 });
                }
            });
        }
    })
}

const update_wealth = (req, res) => {
    let query = `INSERT INTO wealth_records (income, expense, user_id) VALUES(${req.body.income}, ${req.body.expense}, ${req.body.user_id})`;

    connection.query(query, (err, resp) => {
        if (err) {
            console.log(err);
        }
        else {

            let get = `SELECT * FROM user_wealth WHERE user_id = ${req.body.user_id}`;
            connection.query(get, (er, rows) => {
                if (er) {
                    console.log(er);
                }
                else if (rows && rows.length > 0) {

                    let total_inc = Number(req.body.income) + rows[0].total_Income;
                    let total_exp = Number(req.body.expense) + rows[0].total_expense;

                    let update = `Update user_wealth SET total_Income = ?, total_expense = ? WHERE user_id = ?`;
                    let if_update = connection.query(update, [total_inc, total_exp, req.body.user_id], (e, resp) => {
                        if (e) {
                            console.log(e);
                        }
                        else {
                            res.send({ msg: "Wealth Data Updated Successfully", error: 0 });
                        }
                    });
                }
                else {
                    res.send({ msg: "Something Went Wrong", error: 1 });
                }
            })
        }
    })
}

const get_wealth = (req, res) => {
    let query = `SELECT * FROM wealth_records WHERE user_id = ${req.body.user_id}`;
    console.log(query);
    connection.query(query, (err, rows) => {
        if (err) {
            console.log(err);
        }
        else if (rows && rows.length > 0) {

            console.log("hehehe");
            let sql = `SELECT * FROM user_wealth WHERE user_id = ${req.body.user_id}`;
            connection.query(sql, (e, resp) => {
                if (e) {
                    console.log(e);
                }
                else {
                    res.send({ msg: "Wealth Data Fetched Successfully", error: 0, data: rows, overall_val: resp });
                }
            })
        }
        else {
            res.send({ msg: "No records Found!!", error: 1 });
        }
    })
}

module.exports = { add_user, login_user, healthData, sleepData, waterData, user_info, user_diet, update_user, get_all_diet, get_water_data, update_water_data, getWorkouts, selectWorkout, getselectWorkout, DonewithtWorkout, wealthData, update_wealth, get_wealth }
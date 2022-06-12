const express = require("express");
const router = express.Router();
const control = require("./controller");
// const prod = require("./controller");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

router.post('/first_register', jsonParser, control.add_user);
router.post('/user_info', jsonParser, control.user_info);
router.post('/login_user', jsonParser, control.login_user);
router.post('/user_diet', jsonParser, control.user_diet);
router.post('/user_health', jsonParser, control.healthData);
router.post('/user_sleep', jsonParser, control.sleepData);
router.post('/user_water', jsonParser, control.waterData);
router.post('/update_user', jsonParser, control.update_user);
router.post('/get_all_diet', jsonParser, control.get_all_diet);
router.post('/get_water_data',jsonParser,control.get_water_data);
router.post('/update_water_data',jsonParser,control.update_water_data);
router.post('/getWorkouts',jsonParser,control.getWorkouts);
router.post('/selectWorkout',jsonParser,control.selectWorkout);
router.post('/getselectWorkout',jsonParser,control.getselectWorkout);
router.post('/DonewithtWorkout',jsonParser,control.DonewithtWorkout);
module.exports = router;
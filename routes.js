const express = require("express");
const router = express.Router();
const control = require("./controller");
// const prod = require("./controller");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

router.get('/all_users',control.allUsers);
router.post('/first_register',jsonParser, control.add_user);
router.post('/login_user',jsonParser, control.login_user);
router.post('/user_health',jsonParser, control.healthData);
router.post('/user_sleep',jsonParser, control.sleepData);
router.post('/user_water',jsonParser, control.waterData);

module.exports = router;
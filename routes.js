const express = require("express");
const router = express.Router();
const control = require("./controller");
// const prod = require("./controller");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

router.post('/first_register',jsonParser, control.add_user);
router.post('/user_info',jsonParser, control.user_info);
router.post('/login_user',jsonParser, control.login_user);
router.get('/user_diet',jsonParser, control.user_diet);
router.post('/user_health',jsonParser, control.healthData);
router.post('/user_sleep',jsonParser, control.sleepData);
router.post('/user_water',jsonParser, control.waterData);
router.post('/update_user',jsonParser, control.update_user);

module.exports = router;
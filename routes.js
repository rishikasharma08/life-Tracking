const express = require("express");
const router = express.Router();
const control = require("./controller");
// const prod = require("./controller");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

router.post('/first_register',jsonParser, control.add_user);
router.post('/login_user',jsonParser, control.login_user);
router.post('/user_health',jsonParser, control.healthData);

module.exports = router;
const express = require('express');
const router = express.Router();
const ctrlUsernames = require('../controller/ctrl-usernames');

router.route('/').get(ctrlUsernames.get_index).post(ctrlUsernames.post_index);

router.route('/usernames').get(ctrlUsernames.get_usernames);

module.exports = router;

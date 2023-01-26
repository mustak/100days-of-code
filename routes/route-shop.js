const express = require('express');

const router = express.Router();

router.route(['/', '/signup']).get((req, res, next) => {
    res.render('shop/admin/signup');
});

module.exports = router;

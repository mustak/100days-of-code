const express = require('express');
const util = require('util');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

const db = require('../data/db-mongodb');
// const cntblog = require('../controller/c-blogmongo');

const router = express.Router();

let homeRoute = '/auth';
let routeLinks = {
    home: `${homeRoute}/`,
};

function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('./login');
    }
}

router.use(function (req, res, next) {
    if (req.session.isAuthenticated) {
        res.locals.isAuthenticated = req.session.isAuthenticated;
    } else {
        res.locals.isAuthenticated = false;
    }
    next();
});

/**
 * Home
 */
router.route('/').get((req, res, next) => {
    res.render('auth/welcome');
});

/**
 * Signup
 */
router
    .route('/signup')
    .get((req, res, next) => {
        res.render('auth/signup');
    })
    .post(async (req, res, next) => {
        const { email, password, 'confirm-email': confirmEmail } = req.body;
        // validate input
        // if(!email || !password || !confirmEmail || email.length <= 6 || email !== confirmEmail )
        // check user does not already exist in db.

        const hashPassword = await bcrypt.hash(password, 12);
        await db.getDb().collection('users').insertOne({
            email: email,
            password: hashPassword,
        });
        res.redirect(`./login`);
    });

/**
 * LOgin
 */
router
    .route('/login')
    .get((req, res, next) => {
        res.render('auth/login');
    })
    .post(async (req, res, next) => {
        const { email, password } = req.body;
        //validate inputs

        const userExists = await db
            .getDb()
            .collection('users')
            .findOne({ email: email });

        if (!userExists) {
            res.redirect('./login');
        }

        const match = await bcrypt.compare(password, userExists.password);

        if (match) {
            req.session.regenerate(function (err) {
                if (err) next(err);

                req.session.user = {
                    id: userExists._id,
                    email: userExists.email,
                };
                req.session.isAuthenticated = true;

                req.session.save(function (err) {
                    if (err) next(err);
                    res.redirect('./admin');
                });
            });
        } else {
            res.redirect('./login');
        }
    });

router.route('/admin').get(isAuthenticated, (req, res, next) => {
    // console.log(req.session.user.email);
    res.render('auth/admin');
});

router.route('/logout').post((req, res, next) => {
    req.session.iser = null;
    req.session.isAuthenticated = false;

    req.session.save(function (err) {
        if (err) next(err);

        req.session.regenerate(function (err) {
            if (err) next(err);

            res.redirect('./login');
        });
    });
});

/**
 * Error handlers
 */
// router.use(function (req, res, next) {
//     console.log(`>> Error for following request: ${req.originalUrl}`);
//     res.status(404).send(`The requested resource cannot be located`);
// });

// router.use(function (error, req, res, next) {
//     if (res.headersSent) {
//         return next(err);
//     }
//     console.log(err);
//     res.status(500).render(`server error: ${error}`);
// });

function log(obj) {
    console.log(
        util.inspect(obj, {
            showHidden: true,
            depth: null,
            colors: true,
        })
    );
}

module.exports = router;

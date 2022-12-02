const fs = require('fs');
const path = require('path');
const express = require('express');

const cntblog = require('../controller/c-blogmongo');

const { faker } = require('@faker-js/faker');
const db = require('../data/db-mongodb');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

let homeRoute = '/blog';
let routeLinks = {
    home: `${homeRoute}/`,
    posts: `${homeRoute}/posts`,
    new: `${homeRoute}/new-post`,
};
cntblog.setRoute(homeRoute);

router.route(['/', '/posts']).get(cntblog.get_home).post(cntblog.post_newPost);

router.route('/new-post').get(cntblog.get_newPost);

router.route('/posts/:id').get(cntblog.get_postDetails);

router
    .route('/posts/:id/edit')
    .get(cntblog.get_postEdit)
    .post(cntblog.post_postEdit);

router.route('/posts/:id/delete').post(async (req, res) => {
    const postID = req.params.id;

    const query = `
        DELETE FROM posts 
        WHERE id=?
    `;

    try {
        await db.query(query, [postID]);
        res.redirect(routeLinks.home);
    } catch (error) {
        next(error);
    }
}); // end get;

/**
 * Error handlers
 */
router.use(function (req, res, next) {
    console.log(`>> Error for following request: ${req.originalUrl}`);
    res.status(404).render('blog/404', {
        links: routeLinks,
        title: `The resource requested cannot be found. [${homeRoute}]`,
    });
});

router.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(500).render('blog/500', {
        links: routeLinks,
        title: `Server Error: ${err}`,
    });
});

// module.exports = router;
// exports.routeBase = homeRoute;
// exports.router = router;

module.exports = function setRoute(route) {
    homeRoute = route;
    routeLinks = {
        home: `${homeRoute}/`,
        posts: `${homeRoute}/posts`,
        new: `${homeRoute}/new-post`,
    };
    cntblog.setRoute(homeRoute);
    return router;
};

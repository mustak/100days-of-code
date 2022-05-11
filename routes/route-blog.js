const fs = require('fs');
const path = require('path');
const express = require('express');
const { faker } = require('@faker-js/faker');
const router = express.Router();

let homeRoute = '/blog';
let routeLinks = {
    home: `${homeRoute}/`,
    posts: `${homeRoute}/posts`,
    new: `${homeRoute}/new-post`,
};

router.route(['/', '/posts']).get((req, res) => {
    res.render('blog/posts-list', { links: routeLinks });
});

router.route('/new-post').get((req, res) => {
    const fakeData = {
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentences(),
        content: faker.lorem.paragraphs(),
    };
    res.render('blog/create-post', { links: routeLinks, data: fakeData });
});

/**
 * Error handlers
 */
router.use(function (req, res, next) {
    // console.log('##' + err + '##');
    res.render('blog/404', {
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
        title: `Server Error. ${err}`,
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
    return router;
};

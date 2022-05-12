const fs = require('fs');
const path = require('path');
const express = require('express');
const { faker } = require('@faker-js/faker');
const db = require('../data/db-mysql');
const router = express.Router();

let homeRoute = '/blog';
let routeLinks = {
    home: `${homeRoute}/`,
    posts: `${homeRoute}/posts`,
    new: `${homeRoute}/new-post`,
};

router
    .route(['/', '/posts'])
    .get((req, res, next) => {
        const query = `SELECT p.*, a.name AS author_name, a.email AS author_email FROM posts AS p INNER JOIN authors AS a ON p.author_id = a.id`;

        db.query(query)
            .then(([result]) => {
                // console.log(result);
                res.render('blog/posts-list', {
                    links: routeLinks,
                    posts: result,
                });
            })
            .catch((err) => {
                next(err);
            });
    })
    .post(async (req, res) => {
        const { title, summary, content, author } = req.body;
        const data = [title, summary, content, author];
        const [result, fields] = await db.query(
            'INSERT INTO posts (title,summary,body,author_id) VALUES (?)',
            [data]
        );
        // res.send('added');
        res.redirect(routeLinks.home);
    });

router.route('/new-post').get(async (req, res) => {
    const [authors] = await db.query('SELECT * FROM authors');

    const fakeData = {
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentences(),
        content: faker.lorem.paragraphs(),
        authors,
    };
    res.render('blog/create-post', { links: routeLinks, data: fakeData });
});

/**
 * Error handlers
 */
router.use(function (req, res, next) {
    // console.log('##' + err + '##');
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
    return router;
};

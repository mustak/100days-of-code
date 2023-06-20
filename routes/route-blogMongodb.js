const express = require('express');
const db = require('../data/db-mongodb');
const ObjectId = require('mongodb').ObjectId;

const cntblog = require('../controller/c-blogmongo');

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

router.route('/posts/:id/delete').post(cntblog.post_delete); // end get;

/***
 * Comments routes
 */
router.get('/posts/:id/comments', async function (req, res) {
    if (!req.params.id) {
        return res.status(404).json({
            message: 'The requested resource cannot be found on the server.',
        });
    }
    const postId = new ObjectId(req.params.id);
    try {
        const comments = await db
            .getDb()
            .collection('comments')
            .find({ postId: postId })
            .toArray();

        return res.json({ message: 'OK', comments: comments });
    } catch (error) {
        return res.status(500).json({
            message: 'Database error',
        });
    }
});

router.post('/posts/:id/comments', async function (req, res) {
    const postId = new ObjectId(req.params.id);
    const newComment = {
        postId: postId,
        title: req.body.title,
        text: req.body.text,
    };
    const result = await db
        .getDb()
        .collection('comments')
        .insertOne(newComment);

    res.json({ message: 'comment added' });
});

/**
 * Error handlers
 */
router.use(function (req, res, next) {
    console.log(`>> Error for following request: ${req.originalUrl}`);
    res.status(404).render('blogmongodb/404', {
        links: routeLinks,
        title: `The resource requested cannot be found. [${homeRoute}]`,
    });
});

router.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(500).render('blogmongodb/500', {
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
        home: `${homeRoute}`,
        posts: `${homeRoute}/posts`,
        new: `${homeRoute}/new-post`,
    };
    cntblog.setRoute(homeRoute);
    return router;
};

const fs = require('fs');
const path = require('path');
const express = require('express');
const { faker } = require('@faker-js/faker');
const db = require('../data/db-mysql');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let homeRoute = '/blog';
let routeLinks = {
    home: `${homeRoute}/`,
    posts: `${homeRoute}/posts`,
    new: `${homeRoute}/new-post`,
};

router
    .route(['/', '/posts'])
    .get(async (req, res, next) => {
        try {
            const posts = await prisma.post.findMany({
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    date: true,
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: [{ date: 'desc' }],
            }); // findMany

            res.render('blog/posts-list', {
                links: routeLinks,
                posts: posts,
            });
        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res) => {
        const { title, summary, content, author } = req.body;

        try {
            const result = await prisma.post.create({
                data: {
                    body: content,
                    summary,
                    title,
                    // either
                    author_id: +author,
                    // or
                    // author: {
                    //     connect: { id: +author },
                    // },
                },
            });

            res.redirect(routeLinks.home);
        } catch (error) {
            next(error);
        }
    });

router.route('/new-post').get(async (req, res) => {
    const authors = await prisma.author.findMany();

    const fakeData = {
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentence(7),
        content: faker.lorem.paragraphs(),
        authors,
    };
    res.render('blog/create-post', { links: routeLinks, data: fakeData });
});

router.route('/posts/:id').get((req, res, next) => {
    const id = req.params.id;
    const query = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email
    FROM posts 
        INNER JOIN authors 
        ON posts.author_id = authors.id
    WHERE posts.id = ?
    `;
    db.query(query, [id])
        .then(([result]) => {
            if (!result || result.length <= 0) {
                return res.status(404).render('blog/404', {
                    links: routeLinks,
                    title: `The resource requested cannot be found. [${homeRoute}]`,
                });
            }

            res.render('blog/post-detail', {
                links: routeLinks,
                post: result[0],
            });
        })
        .catch((err) => {
            next(err);
        });
});

router
    .route('/posts/:id/edit')
    .get((req, res, next) => {
        const id = req.params.id;

        const queryPosts = `
            SELECT id, title, summary, body, author_id
            FROM posts
            WHERE id=?
        `;

        const queryAuthors = `
            SELECT id, name FROM authors
        `;

        Promise.all([db.query(queryPosts, [id]), db.query(queryAuthors)])
            .then(([[post], [authors]]) => {
                // console.log(post[0], authors);
                res.render('blog/update-post', {
                    links: routeLinks,
                    post: post[0],
                    authors,
                });
            })
            .catch((err) => next(err));
    })
    .post(async (req, res, next) => {
        const id = req.params.id;
        const { author_id, title, summary, content } = req.body;

        const query = `
            UPDATE posts 
            SET 
                title=?, 
                summary=?, 
                body=?,
                author_id=?
            WHERE id=?
        `;

        try {
            await db.query(query, [title, summary, content, author_id, id]);
            res.redirect(routeLinks.home);
        } catch (err) {
            next(err);
        }

        // res.send('posted data. see console.');
    });

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
    return router;
};

const { faker } = require('@faker-js/faker');
const db = require('../data/db-mongodb');
const ObjectId = require('mongodb').ObjectId;

let homeRoute = '/blogmongodb';
let routeLinks = {
    home: `${homeRoute}/`,
    posts: `${homeRoute}/posts`,
    new: `${homeRoute}/new-post`,
};

exports.get_home = async (req, res) => {
    const posts = await db.getDb().collection('posts').find().toArray();
    res.render('blogmongodb/posts-list', { links: routeLinks, posts });
};

exports.get_newPost = async (req, res) => {
    const authors = await db.getDb().collection('authors').find().toArray();

    const fakeData = {
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentence(7),
        content: faker.lorem.paragraphs(),
        authors,
    };
    res.render('blogmongodb/create-post', {
        links: routeLinks,
        data: fakeData,
    });
};

exports.post_newPost = async (req, res) => {
    const { title, summary, content, author } = req.body;
    let authorObj;

    try {
        authorObj = await db
            .getDb()
            .collection('authors')
            .findOne({ _id: new ObjectId(author) });
    } catch (error) {
        return localError(
            res,
            `The resource requested cannot be found. [post_newPost: getting authors.]`
        );
    }

    try {
        await db.getDb().collection('posts').insertOne({
            title,
            summary,
            content,
            author: authorObj,
            dateAdded: new Date(),
        });
    } catch (error) {
        return localError(
            res,
            `The resource requested cannot be found. [post_newPost: adding new post.]`
        );
    }

    //res.send('added');
    res.redirect(routeLinks.home);
};

exports.get_postDetails = async (req, res, next) => {
    const id = req.params.id;

    const postId = new ObjectId(id);

    try {
        const post = await db
            .getDb()
            .collection('posts')
            .findOne({ _id: postId });

        if (post) {
            return res.render('blogmongodb/post-detail', {
                links: routeLinks,
                post: post,
            });
        } else {
            return localError(
                res,
                `The resource requested cannot be found. [get_postDetails: post notfound.]`
            );
        }
    } catch (error) {
        return next(error);
    }
    res.send('post details');
};

exports.get_postEdit = async (req, res, next) => {
    const id = req.params.id;
    const postId = new ObjectId(id);

    Promise.all([
        db.getDb().collection('posts').findOne({ _id: postId }),
        db.getDb().collection('authors').find().toArray(),
    ])
        .then(([post, authors]) => {
            // console.log(post);
            // res.send(post);
            res.render('blogmongodb/update-post', {
                links: routeLinks,
                post: post,
                authors,
            });
        })
        .catch((err) => next(err));
};

exports.post_postEdit = async (req, res, next) => {
    let postID;
    try {
        postID = new ObjectId(req.params.id);
    } catch (error) {
        return localError(
            res,
            `The resource requested cannot be found. [post_postEdit]`
        );
    }

    const { author_id, title, summary, content } = req.body;
    let authorObj;

    try {
        authorObj = await db
            .getDb()
            .collection('authors')
            .findOne({ _id: new ObjectId(author_id) });
    } catch (error) {
        return localError(
            res,
            `The resource requested cannot be found. [post_post_postEdit]: getting authors.]`
        );
    }

    try {
        await db
            .getDb()
            .collection('posts')
            .updateOne(
                { _id: postID },
                {
                    $set: {
                        title,
                        summary,
                        content,
                        author: authorObj,
                    },
                }
            );
    } catch (error) {
        console.log(error);
        return localError(
            res,
            `The resource requested cannot be found. [post_postEdit: updating post.]`
        );
    }

    //res.send('added');
    res.redirect(routeLinks.home);
};

exports.post_delete = async (req, res, next) => {
    // next('test delete');
    const urlPostID = req.params.id;
    if (!urlPostID) {
        return localError(
            res,
            `The resource requested cannot be found. [post_postDelete: no id sent.]`
        );
    }

    const postID = new ObjectId(req.params.id);

    try {
        await db.getDb().collection('posts').deleteOne({ _id: postID });

        res.redirect(routeLinks.home);
    } catch (error) {
        return localError(res, `Error deleteing post. [post_postDelete]`);
    }
};

function localError(res, title = `The resource requested cannot be found.`) {
    return res.status(404).render('blogmongodb/404', {
        links: routeLinks,
        title: title,
    });
}

/**
 *
 * @param {string} route
 */
exports.setRoute = (route) => {
    homeRoute = route;
    routeLinks = {
        home: `${homeRoute}/`,
        posts: `${homeRoute}/posts`,
        new: `${homeRoute}/new-post`,
    };
};

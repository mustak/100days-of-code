const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

const ObjectId = require('mongodb').ObjectId;
const db = require('../data/db-mongodb');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

router
    .route('/')
    .get(async function (req, res, next) {
        const users = await db.getDb().collection('users').find().toArray();

        res.render('fileuploads/home', {
            title: 'User Profiles',
            users: users,
        });
    })
    .post(upload.single('file'), async function (req, res, next) {
        // console.log(req.body);
        // console.log(req.files);
        // console.log(req.file);

        db.getDb().collection('users').insertOne({
            name: req.body.name,
            avatar: req.file.path,
        });
        res.redirect('./');
    });

router.route('/:id/delete').post(async function (req, res, next) {
    const id = new ObjectId(req.params.id);

    try {
        const user = await db.getDb().collection('users').findOne({ _id: id });

        if (user) {
            const abPath = path.resolve(user.avatar);
            fs.rmSync(abPath, { force: true });
            await db.getDb().collection('users').deleteOne({ _id: id });
        } else {
            console.log('user not found.');
        }
    } catch (error) {
        console.log(error);
    }

    res.redirect('/fileuploads');
});

router.route('/page1/').get(async function (req, res, next) {
    res.render('fileuploads/home', { title: 'Page 1' });
});

router.route('/page2').get(async function (req, res, next) {
    res.render('fileuploads/home', { title: 'Page 2' });
});

module.exports = router;

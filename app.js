const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const db = require('./data/db-mongodb');

const routerUsernames = require('./routes/route-usernames');
const routerRestaurants = require('./routes/route-restaurants');
const routerBlog = require('./routes/route-blog');
const routerBlogMongodb = require('./routes/route-blogMongodb');
const routeFileUploads = require('./routes/route-fileuploads');
const routeAuth = require('./routes/route-auth');

const PORT = 3000;
const app = express();

app.use(helmet()); //set security-related HTTP response headers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const store = new MongoDBStore({
    uri: db.url,
    databaseName: 'blog',
    collection: 'sessions',
});
store.on('error', function (error) {
    console.log(error);
});

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.set('views', path.join(__dirname, 'views/ejs'));
app.set('view engine', 'ejs');

app.use('/', routerUsernames);
app.use('/restaurants', routerRestaurants('/restaurants'));
app.use('/blog', routerBlog('/blog'));
app.use('/blogmongodb', routerBlogMongodb('/blogmongodb'));
app.use('/fileuploads/', routeFileUploads);
app.use('/auth', routeAuth);

app.use(function (req, res, next) {
    res.render('restaurants/404', {
        links: null,
        title: 'The resource requested cannot be found. [/]',
    });
});
// app.use(function (err, req, res, next) {
//     console.log(`app.js:37: ${err}`);
//     if (res.headersSent) {
//         return next(err);
//     } else {
//         res.json({ status: 'Error', message: 'error message', error: err });
//     }
// });

db.openDb().then(function () {
    console.log('DB connection opened!!!');
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    }).on('close', function () {
        console.log('[app.js] server closing db connection.');
        db.closeDb();
    });
});

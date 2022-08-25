const path = require('path');
const express = require('express');
const helmet = require('helmet');

const routerUsernames = require('./routes/route-usernames');
const routerRestaurants = require('./routes/route-restaurants');
const routerBlog = require('./routes/route-blog');
const routerBlogMongodb = require('./routes/route-blogMongodb');

const PORT = 3000;
const app = express();

app.use(helmet()); //set security-related HTTP response headers
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views/ejs'));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views/njk'));
// app.set('view engine', 'njk');
// nunjucks.configure('views', {
//     express: app,
//     watch: true,
//     autoescape: true,
//     trimBlocks: true,
//     lstripBlocks: true,
// });

app.use('/', routerUsernames);
app.use('/restaurants', routerRestaurants('/restaurants'));
app.use('/blog', routerBlog('/blog'));
app.use('/blogmongodb', routerBlogMongodb('/blogmongodb'));

app.use(function (req, res, next) {
    res.render('restaurants/404', {
        links: null,
        title: 'The resource requested cannot be found. [/]',
    });
});
app.use(function (err, req, res, next) {
    console.log(`app.js:37: ${err}`);
    if (res.headersSent) {
        return next(err);
    } else {
        res.json({ status: 'Error', message: 'error message', error: err });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

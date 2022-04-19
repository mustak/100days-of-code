const path = require('path');
const express = require('express');
const helmet = require('helmet');

const routerUsernames = require('./routes/route-usernames');
const routerRestaurants = require('./routes/route-restaurants');

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

// app.use(function (err, req, res, next) {
//     console.log(`app.js:32: ${err}`);
//     if (res.headersSent) {
//         return next(err);
//     } else {
//         res.json({ status: 'Error', message: 'error message', error: err });
//     }
// });

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

const fs = require('fs');
const path = require('path');
const express = require('express');
const { faker } = require('@faker-js/faker');
const router = express.Router();

let homeRoute = '/restaurants';
let routeLinks = {
    about: `${homeRoute}/about`,
    confirm: `${homeRoute}/confirm`,
    home: `${homeRoute}/`,
    recommend: `${homeRoute}/recommend`,
    restaurants: `${homeRoute}/browse`,
    details: `${homeRoute}/browse`,
};

router.route('/').get((req, res) => {
    res.render('index', { links: routeLinks });
});

router.route('/about').get((req, res) => {
    res.render('about', { links: routeLinks });
});

router.route('/browse').get((req, res) => {
    const restaurants = getRestaurants();

    restaurants.sort((a, b) => (a > b ? 1 : -1));

    res.render('restaurants', { links: routeLinks, restaurants });
});

router.route('/browse/:id').get((req, res) => {
    const rID = req.params.id;
    const restaurants = getRestaurants();
    const restaurant = restaurants.find((restaurant) => restaurant.id === rID);
    if (restaurant) {
        res.render('restaurant-details', { links: routeLinks, restaurant });
    } else {
        res.render('404', { links: routeLinks });
    }
});

router
    .route('/recommend')
    .get((req, res) => {
        const fakeData = {
            name: faker.company.companyName(),
            address: faker.address.streetAddress(),
            cuisine: faker.address.country(),
            website: faker.internet.url(),
            description: faker.lorem.paragraph(),
        };
        res.render('recommend', { links: routeLinks, data: fakeData });
    })
    .post((req, res) => {
        const restaurant = req.body;
        restaurant.id = faker.datatype.uuid();
        const restaurants = getRestaurants();
        restaurants.push(restaurant);

        const filePath = path.join(__dirname, '..', 'data/restaurants.json');
        // NOTE: Saving to a local file(restaurant.json)
        // will trigger nodemon to reload, and some files will
        // not be served.
        // Therefore add file to "ignore" in nodemon.json
        fs.writeFileSync(filePath, JSON.stringify(restaurants));

        res.redirect('confirm');
    });

router.route('/confirm').get((req, res) => {
    res.render('confirm', { links: routeLinks });
});

/**
 * Error handlers
 */
router.use(function (req, res, next) {
    // console.log('##' + err + '##');
    res.render('404', {
        links: routeLinks,
        title: `The resource requested cannot be found. [${homeRoute}]`,
    });
});

router.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).render('500', {
        links: routeLinks,
        title: `Server Error. ${err}`,
    });
});

// module.exports = router;
// exports.routeBase = homeRoute;
// exports.router = router;

function getRestaurants() {
    const filePath = path.join(__dirname, '..', 'data/restaurants.json');
    const fileContent = fs.readFileSync(filePath);
    return JSON.parse(fileContent);
}

module.exports = function setRoute(route) {
    homeRoute = route;
    routeLinks = {
        about: `${homeRoute}/about`,
        confirm: `${homeRoute}/confirm`,
        home: `${homeRoute}/`,
        recommend: `${homeRoute}/recommend`,
        restaurants: `${homeRoute}/browse`,
        details: `${homeRoute}/browse`,
    };
    return router;
};

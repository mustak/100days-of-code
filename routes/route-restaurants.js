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
};

router.route('/').get((req, res) => {
    res.render('index', { links: routeLinks });
});

router.route('/about').get((req, res) => {
    res.render('about', { links: routeLinks });
});

router.route('/browse').get((req, res) => {
    const restaurants = getRestaurants();

    res.render('restaurants', { links: routeLinks, restaurants });
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
    };
    return router;
};

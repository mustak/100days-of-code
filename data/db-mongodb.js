// const mongodb = require('mongodb');
// const MongoClient = mongodb.mongoClient;

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
///
let database;
let client;

///
async function openDb() {
    console.log('[db-mongodb.js] opening db connection.');
    client = await MongoClient.connect(url);
    //database = client.db('blog');
}

///
function getDb() {
    if (!client) {
        throw { message: 'Database connection not established!' };
    }

    //return database;
    return client.db('blog');
}

function closeDb() {
    console.log('[db-mongodbs.js] closing db connection.');
    client.close(() => console.log('mongodb connection closed!!!'));
}

module.exports = {
    openDb,
    getDb,
    closeDb,
};

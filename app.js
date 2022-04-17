const express = require('express');
const helmet = require('helmet');

const routerUsernames = require('./routes/route-usernames');

const PORT = 3000;
const app = express();

app.use(helmet()); //set security-related HTTP response headers
app.use(express.urlencoded({ extended: false }));

app.use('/', routerUsernames);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

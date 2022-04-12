const express = require('express');
const helmet = require('helmet');

const PORT = 3000;

const app = express();

app.use(helmet()); //set security-related HTTP response headers
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(
        `<form method='POST'><label>Name: <input type='text' name='username'/></label><button>Submit</button></form>`
    );
});

app.post('/', (req, res) => {
    console.dir(req.body);
    const { username } = req.body;

    res.send(`Name: ${username} added.`);
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

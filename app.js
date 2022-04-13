const fs = require('fs');
const path = require('path');
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
    const { username } = req.body;

    const filePath = path.join(__dirname, 'usernames.json');
    const fileContent = fs.readFileSync(filePath);
    const fileData = JSON.parse(fileContent);
    fileData.push(username);

    fs.writeFileSync(filePath, JSON.stringify(fileData));
    res.send(`Name: ${username} added.`);
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

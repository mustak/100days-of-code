const fs = require('fs');
const path = require('path');

exports.get_index = (req, res, next) => {
    res.send(
        `<form method='POST'><label>Name: <input type='text' name='username'/></label><button>Submit</button></form>`
    );
};

exports.post_index = (req, res, next) => {
    const { username } = req.body;

    const filePath = path.join(__dirname, '..', 'data/usernames.json');
    const fileContent = fs.readFileSync(filePath);
    const fileData = JSON.parse(fileContent);
    fileData.push(username);

    fs.writeFileSync(filePath, JSON.stringify(fileData));
    res.send(`Name: ${username} added.`);
};

exports.get_usernames = (req, res, next) => {
    const filePath = path.join(__dirname, '..', 'data/usernames.json');
    const fileContent = fs.readFileSync(filePath);
    const fileData = JSON.parse(fileContent);

    let html = '<h1>Usernames</h1><ul>';

    fileData.forEach((user) => {
        html += `<li>${user}</li>`;
    });
    html += '</ul>';
    res.send(html);
};

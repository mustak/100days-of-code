const Tokens = require('csrf');

const tokens = new Tokens();
let secret;

function xsrf() {
    return xsrfMiddleware;
}

async function xsrfMiddleware(req, res, next) {
    if (req.method === 'GET') {
        secret = await tokens.secret();
        req.session.csrfSecret = secret;

        req.csrfToken = getToken;
        req.fieldname = getFieldname(req);
        next();
    }

    if (req.method === 'POST') {
        const { [req.session.fieldname]: _csrf } = req.body;
        console.log(_csrf);
        // next();
        if (tokens.verify(req.session.csrfSecret, _csrf)) {
            next();
        } else {
            return res.status(403).render('403');
        }
    }
}

function getToken() {
    const csrfToken = tokens.create(secret);
    return csrfToken;
}

function getFieldname(req) {
    return () => {
        const fieldname = tokens.create(secret);
        req.session.fieldname = fieldname;

        return fieldname;
    };
}

module.exports = xsrf;

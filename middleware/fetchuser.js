const jwt = require('jsonwebtoken');
const JWT_SECRET = 'akshay';

const fetchuser = (req, res, next) => {
    // get the user from jwt token an add id to req object
    const token = req.header('auth-token');

    if (!token) {
        res.status(400).send({error: 'Please authenticate using a valid token'});
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: 'Please authentiate using a valid token'});
    }

}

module.exports = fetchuser;
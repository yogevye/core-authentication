const jwt = require('jsonwebtoken');
const User = require('../db//models/user');

const authAndValidateUser = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const user = await User.findOne({ _id: data.id, 'tokens.token': token });
        if (!user) {
            throw new Error()
        }
        req.user = user;
        req.tokenData = data;
        req.token = token;
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
};

const auth = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.tokenData = data;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: error.message })
    }

};
module.exports = {authAndValidateUser, auth};
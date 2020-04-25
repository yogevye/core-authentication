const jwt = require('jsonwebtoken');
const User = require('../db//models/user');

const expiryDelta = process.env.AUTH_EXPIRY_DELTA || (24 *60 * 60 * 1000);

const authAndValidateUser = async(req, res, next) => {
    try {
        const token = validateToken(req.header('Authorization').replace('Bearer ', ''));
        const tokenData = validateToken(token);
        const user = await validateUser(tokenData, token);
        req.user = user;
        req.tokenData = tokenData;
        req.token = token;
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
};

const auth = async(req, res, next) => {
    try{
        const token = validateToken(req.header('Authorization').replace('Bearer ', ''));
        const tokenData = validateToken(token);
        req.tokenData = tokenData;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: error.message })
    }
};

const validateToken = (token) => {
    const tokenData = jwt.verify(token, process.env.JWT_KEY);
    if(!tokenData || !data.creationTime || new Date().getTime() > (tokenData.creationTime + expiryDelta)){
        throw new Error(`token expired. userId: ${tokenData.id}`);
    }
    return {tokenData};
};

const validateUser = async (tokenData, token) =>{
    const user = await User.findOne({ _id: tokenData.id, 'tokens.token': token });
    if (!user) {
        throw new Error('user does not exist')
    }
    return user;
};

module.exports = {authAndValidateUser, auth};
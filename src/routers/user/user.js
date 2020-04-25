const express = require('express');
const passport = require('passport');
const passportConf = require('../../passport/passport')
const {auth, authAndValidateUser} = require('../../middleware/auth');
const {login, signUp, logout, logoutAll} = require('./user-handler/user-handler');

const router = express.Router();

router.post('/', signUp);

router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.tokenData)
});

router.post('/logout', authAndValidateUser, logout);

router.post('/logoutall', authAndValidateUser, logoutAll);

router.route('/login')
    .post(passport.authenticate('localToken', {session: false}), login);

router.route('/auth/google')
    .post(passport.authenticate('googleToken', {session: false}), login);

router.route('/auth/facebook')
    .post(passport.authenticate('facebookToken', {session: false}), login);

module.exports = router;
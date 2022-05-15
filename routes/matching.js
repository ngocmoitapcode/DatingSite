const express = require('express');
const router = express.Router();
var database = require('../models/database');

// chưa login thì không được truy cập
var redirectToHomePage = (req, res, next) => {
    if (!req.session.user && !req.cookies.user_sid) {
        res.redirect("/");
    } else {
        next();
    }
};

const transformRecommendedUsers = (users) => {
    if (users && users.length !== 0) {
        return users.map(user => {
            return {
                id: user.id,
                user_age: user.user_age,
                user_avatar: user.user_avatar,
                user_cometchat_uid: user.user_cometchat_uid,
                user_email: user.user_email,
                user_full_name: user.user_full_name,
                user_gender: user.user_gender
            }
        });
    }
    return users;
}

router.route('/recommend')
    .get(redirectToHomePage, async (req, res) => {
        const { user_gender, user_cometchat_uid } = req.session.user;
        if (user_gender && user_cometchat_uid) {
            const user = transformRecommendedUsers(await database.recommendUsers(user_gender, user_cometchat_uid));
            res.send(user);
        }
    })

router.route('/request')
    .get(redirectToHomePage, async (req, res) => {

    })


module.exports = router;
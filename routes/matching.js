const express = require('express');
const router = express.Router();
var database = require('../models/database');

// chưa login thì không được truy cập
var redirectToLoginPage = (req, res, next) => {
    if (!req.session.user && !req.cookies.user_sid) {
        res.redirect("/login");
    } else {
        next();
    }
};

const transformRecommendedUsers = (users) => {
    if (users && users.length !== 0) {
        return users.map(user => {
            return {
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

router.route('/info')
    .get(redirectToLoginPage, (req, res) => {
        const { user_gender, user_cometchat_uid, user_avatar, user_full_name } = req.session.user;
        if (user_gender && user_cometchat_uid) {
            res.status(200).jsonp({ user_gender, user_cometchat_uid, user_avatar, user_full_name });
        }
    })

router.route('/recommend')
    .get(redirectToLoginPage, async (req, res) => {
        const { user_gender, user_cometchat_uid } = req.session.user;
        if (user_gender && user_cometchat_uid) {
            const users = transformRecommendedUsers(await database.recommendUsers(user_gender, user_cometchat_uid));
            res.status(200).jsonp(users);
        }
    })

// chưa test
router.route('/request')
    .post(redirectToLoginPage, async (req, res) => {
        const { matchRequestFrom, matchRequestTo, matchRequestSender, matchRequestReceiver } = req.body;

        if (matchRequestFrom && matchRequestTo && matchRequestSender && matchRequestReceiver) {
            const matchRequest = await database.checkMatchRequest(matchRequestTo, matchRequestFrom);
            // kiểm tra 'to' đã like 'from' chưa
            if (matchRequest && matchRequest.length !== 0) {
                // nếu 'to' đã like 'from' rồi thì match
                if (await database.updateMatchRequest(matchRequest[0].id)) {
                    return res.status(200).jsonp({ match_request_status: 1 });
                };
            } else {
                // nếu 'to' chưa like 'from' thì tạo request mới
                database.insertNewRequest(matchRequestFrom, matchRequestTo, matchRequestSender, matchRequestReceiver);
            }
        }
    })


module.exports = router;
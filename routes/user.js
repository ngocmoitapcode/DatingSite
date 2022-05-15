const express = require('express');
const router = express.Router();
const path = require('path');
var database = require('../models/database');

// login rồi thì không được truy cập
var redirectToHomePage = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect("/");
    } else {
        next();
    }
};

router.route('/login')
    .get(redirectToHomePage, (req, res) => {
        res.sendFile(path.resolve("./public/login.html"));
    })
    .post(async (req, res) => {
        // get user data from req.body
        const { email, password } = req.body;

        // verify user data
        let results = await database.checkUserEmail(email);
        if (!results || !database.checkPassword(results, password)) {
            console.log('Email or password is incorrect');
            return res.redirect("/login");
        }

        // save user's data in session memory
        req.session.user = { user_cometchat_uid: results[0].user_cometchat_uid, user_full_name: results[0].user_full_name, user_gender: results[0].user_gender };
        console.log(`Welcome ${results[0].user_full_name}`);

        return res.redirect('/');
    })

router.route('/signup')
    .get(redirectToHomePage, (req, res) => {
        res.sendFile(path.resolve("./public/signup.html"));
    })
    .post(async (req, res) => {
        // get user data from req.body
        let { email, password, fullname, age, avatar, gender } = req.body;
        avatar = 'test_path';

        // verify user data
        if (await database.checkUserEmail(email)) {
            console.log('Email already existed');
            return res.redirect('/signup');
        }

        //create and save user's data in session memory
        const users = [email, password, fullname, age, avatar, gender];

        req.session.user = { user_cometchat_uid: await database.createAccount(users), user_full_name: fullname, user_gender: gender };
        console.log(`Account created`);
        console.log(`Welcome ${fullname}`);

        return res.redirect('/');
    })

// route for user logout
router.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        console.log(`Goodbye ${req.session.user.user_full_name}`);
        res.clearCookie("user_sid");
        res.redirect("/");
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
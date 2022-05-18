const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
var database = require('../models/database');

//===================Middleware===================//

//login rồi thì không được truy cập
var redirectToHomePage = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect("/");
    } else {
        next();
    }
};

//config kho lưu file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //config vị trí lưu file
        cb(null, "./public/img");
    },

    filename: function (req, file, cb) {
        //config tên file
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

//===================Route===================//

//route for login
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

//route for signup
router.route('/signup')
    .get(redirectToHomePage, (req, res) => {
        res.sendFile(path.resolve("./public/signup.html"));
    })
    .post(upload.single("avatar"), async (req, res) => {
        // get user data from req.body
        const { email, password, fullname, age, gender } = req.body;

        const avatar = `/img/${req.file.filename}`;

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

//route for logout
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
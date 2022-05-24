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

// chỉ lưu file nếu user info valid
const fileFilter = async (req, file, cb) => {
    // get user email from req.body
    const { email } = req.body;

    // verify user email
    if (await database.checkUserEmail(email)) {
        return cb('Email already existed');
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('avatar');

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
            res.status(200).jsonp({ message: "Your email or password is incorrect" });
            return;
        }

        // save user's data in session memory
        req.session.user = { user_cometchat_uid: results[0].user_cometchat_uid, user_full_name: results[0].user_full_name, user_gender: results[0].user_gender };
        console.log(`Welcome ${results[0].user_full_name}`);

        // send session data to client
        res.status(200).jsonp(req.session.user);
    })

//route for signup
router.route('/signup')
    .get(redirectToHomePage, (req, res) => {
        res.sendFile(path.resolve("./public/signup.html"));
    })
    .post((req, res) => {
        upload(req, res, async (err) => {
            // verify user data
            if (err) {
                res.status(200).jsonp({ message: err });
                return;
            }

            // get user data from req.body
            const { email, password, fullname, age, gender } = req.body;

            const avatar = `/img/${req.file.filename}`;

            //create and save user's data in session memory
            const users = [email, password, fullname, age, avatar, gender];

            req.session.user = { user_cometchat_uid: await database.createAccount(users), user_full_name: fullname, user_gender: gender, user_avatar: avatar };
            console.log(`Account created`);
            console.log(`Welcome ${fullname}`);

            // send session data to client
            res.status(200).jsonp(req.session.user);
        });
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
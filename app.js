const express = require('express');
const app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var { checkUserEmail, checkPassword, createAccount } = require('./models/User');

app.use(express.static('./public'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/");
  } else {
    next();
  }
};

// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});

app.route('/login')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
  })
  .post(async (req, res) => {
    // get user data from req.body
    const { email, password } = req.body;

    // verify user data
    let results = await checkUserEmail(email);
    if (!results || !checkPassword(results, password)) {
      console.log('Email or password is incorrect');
      return res.redirect("/login");
    }

    // save user's data in session memory
    req.session.user = { user_cometchat_uid: results[0].user_cometchat_uid, user_full_name: results[0].user_full_name, user_gender: results[0].user_gender };
    console.log(`Welcome ${results[0].user_full_name}`);

    return res.redirect('/');
  })

app.route('/signup')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
  })
  .post(async (req, res) => {
    // get user data from req.body
    let { email, password, fullname, age, avatar, gender } = req.body;
    avatar = 'test_path';

    // verify user data
    if (await checkUserEmail(email)) {
      console.log('Email already existed');
      return res.redirect('/signup');
    }
    
    //create and save user's data in session memory
    const users = [email, password, fullname, age, avatar, gender];

    req.session.user = { user_cometchat_uid: await createAccount(users), user_full_name: fullname, user_gender: gender };
    console.log(`Account created`);
    console.log(`Welcome ${fullname}`);

    return res.redirect('/');
  })

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    console.log(`Goodbye ${req.session.user.user_full_name}`);
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.listen(8080, () => {
  console.log(`App is listening on port 8080`)
});
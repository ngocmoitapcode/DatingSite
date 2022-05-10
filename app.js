const express = require('express');
const app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var { checkUserName, checkPassword, createAccount } = require('./models/User');

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
    const { username, password } = req.body;
    let results = await checkUserName(username);

    // if username doesn't exist or password is incorrect
    if (!results || !checkPassword(results, password)) {
      console.log('Username or password is incorrect');
      return res.redirect("/login");
    }

    // save user's data in session memory
    req.session.user = { user_id: results[0].user_id, username };
    console.log(`Welcome ${username}`);

    res.redirect('/');
  })

app.route('/signup')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
  })
  .post(async (req, res) => {
    const { username, password } = req.body;

    //if username already existed
    if (await checkUserName(username)) {
      console.log('Username already existed');
      return res.redirect('/signup');
    }

    //save user's data in session memory
    req.session.user = { user_id: await createAccount(username, password), username };
    console.log(`Account created`);
    console.log(`Welcome ${username}`);

    res.redirect('/');
  })

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    console.log(`Goodbye ${req.session.user.username}`)
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.listen(8080, () => {
  console.log(`App is listening on port 8080`)
});
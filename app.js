const express = require('express');
const app = express();
var cookieParser = require("cookie-parser");
const cors = require("cors");
var bodyParser = require("body-parser");
var session = require("express-session");
const path = require("path")


// initialize body-parser to parse incoming parameters requests to req.bod
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

app.use(cors());

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

// chưa login thì không được truy cập
var redirectToLoginPage = (req, res, next) => {
  if (!req.session.user && !req.cookies.user_sid) {
    res.redirect("/login");
  } else {
    next();
  }
};

app.get('/', redirectToLoginPage, (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
})

app.use(express.static('./public'));

app.use(require('./routes/user'));
app.use('/user', require('./routes/matching'));

app.listen(8080, () => {
  console.log(`App is listening on port 8080`)
});
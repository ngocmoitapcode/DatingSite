const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

var mysql_pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME
})

let checkUserEmail = function (user_email) {
    return new Promise(function (resolve) {
        const sqlScript = 'SELECT * FROM user_account WHERE user_email = ?';
        mysql_pool.query(sqlScript, [user_email], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;

            // If the account exists
            if (results.length > 0) {
                resolve(results);
            } else {
                resolve(null);
            }
        });
    });
}

let checkPassword = function (results, password) {
    return bcrypt.compareSync(password, results[0].user_password);
}

//save user's account with randomly generated id, hashed password
let createAccount = function (users) {
    let password = users[1];
    let hash_password = bcrypt.hashSync(password, 10);
    const user_cometchat_uid = uuidv4();

    users[1] = hash_password;
    users.push(user_cometchat_uid);

    return new Promise(function (resolve) {
        const sqlScript = 'INSERT INTO user_account (user_email, user_password, user_full_name, user_age, user_avatar, user_gender, user_cometchat_uid) VALUES (?)';

        mysql_pool.query(sqlScript, [users], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
        });
        resolve(user_cometchat_uid);
    });
}

module.exports = { checkUserEmail: checkUserEmail, checkPassword, createAccount };
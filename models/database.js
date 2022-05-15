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

let recommendUsers = function (user_gender, user_cometchat_uid) {
    let target_gender;
    if (user_gender === 'Male') {
        target_gender = 'Female';
    } else {
        target_gender = 'Male';
    }

    return new Promise(function (resolve) {
        // ko hiện người mình từng quẹt hoặc người đã quẹt tới mình và mình đã accept
        const sqlScript = "SELECT * FROM user_account WHERE user_gender = ? AND (user_cometchat_uid NOT IN (SELECT match_request_to FROM match_request WHERE match_request_from = ?) AND user_cometchat_uid NOT IN (SELECT match_request_from FROM match_request WHERE match_request_to = ? AND match_request_status = ?))";

        mysql_pool.query(sqlScript, [target_gender, user_cometchat_uid, user_cometchat_uid, 1], function (error, results, fields) {
            if (error) {
                throw error;
            }
            resolve(results);
        });
    })
}

// kiểm tra 'from' đã like 'to' chưa
let checkRequest = function (match_request_from, match_request_to) {
    return new Promise(function (resolve) {
        const sqlScript = "SELECT * FROM match_request WHERE match_request_from = ? AND match_request_to = ?";

        mysql_pool.query(sqlScript, [match_request_from, match_request_to], function (error, results, fields) {
            if (error) {
                throw error;
            }
            resolve(results);
        });
    });
}

// kiểm tra 'to' đã like 'from' chưa
let checkMatchRequest = function (match_request_from, match_request_to) {
    return new Promise(function (resolve) {
        const sqlScript = "SELECT * FROM match_request WHERE match_request_from = ? AND match_request_to = ?";

        mysql_pool.query(sqlScript, [match_request_to, match_request_from], function (error, results, fields) {
            if (error) {
                throw error;
            }
            resolve(results);
        });
    });
}

let updateMatchRequest = function (match_request_id) {
    return new Promise(function (resolve) {
        const updateMatchRequestSql = "UPDATE match_request SET match_request_status = ?, accepted_date = ? WHERE id = ?";

        mysql_pool.query(updateMatchRequestSql, [1, new Date(), match_request_id], function (error, results, fields) {
            if (error) {
                throw error;
            }
            resolve(results);
        });
    });
}

let insertNewRequest = function (match_request_from, match_request_to, match_request_sender, match_request_receiver) {
    return new Promise(function (resolve) {
        
        const request = [[match_request_from, match_request_to, match_request_sender, match_request_receiver, 0]];
        const sqlScript = "INSERT INTO match_request (match_request_from, match_request_to, match_request_sender, match_request_receiver, match_request_status) VALUES ?";

        mysql_pool.query(sqlScript, [request], function (error, results, fields) {
            if (error) {
                throw error;
            }
            resolve(results);
        });
    });
}

module.exports = { checkUserEmail, checkPassword, createAccount, recommendUsers, checkMatchRequest, updateMatchRequest, insertNewRequest };
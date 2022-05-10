const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

var mysql_pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "changbiet247",
    database: 'sampledatabase'
})

let checkUserName = function (username) {
    return new Promise(function (resolve) {
        mysql_pool.query('SELECT * FROM accounts WHERE username = ?', [username], function (error, results, fields) {
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
    return bcrypt.compareSync(password, results[0].password);
}

//save user's account with randomly generated id, hashed password
let createAccount = function (username, password) {
    let hash_password = bcrypt.hashSync(password, 10);
    let user_id = uuidv4();
    return new Promise(function (resolve) {
        mysql_pool.query('INSERT INTO accounts (user_id, username, password) VALUES (?, ?, ?)', [user_id, username, hash_password], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
        });
        resolve(user_id);
    });
}

module.exports = { checkUserName, checkPassword, createAccount };
var fs = require('fs');
var user_db = JSON.parse(fs.readFileSync('./db/users.json', 'utf8'));

var database = require("./../db/sql_db");

find_user = function(username) {
    console.log("find_user function: " + username);
    var query = "SELECT * FROM `users` WHERE username='" + username + "'";
    console.log("query = " + query);
    return database.query_db(query);
}

add_user = function(username, password) {
    console.log("add_user function: " + username);
    var query = "INSERT INTO `users` (`username`, `password`) VALUES ('" + username + "', '" + password + "')";
    console.log("query = " + query);
    return database.query_db(query);
}

exports.authenticate = function(username, password) {
    return new Promise(function(resolve, reject) {
        find_user(username).then(function(user) {
            console.log(user);
            if (Object.keys(user).length == 0) {
                reject("Cannot find this user");
            } else if (user[0].password.trim() == password.trim()) {
                resolve(user[0]);
            } else {
                reject();
            }
        }).catch(function(rej) {
            console.log(rej);
            reject();
        })
    })
}

exports.add_new = function(username, password) {
    return new Promise(function(resolve, reject) {
        find_user(username).then(function(find_user_resolve) {
            console.log(find_user_resolve);
            if (find_user_resolve.length > 0) {
                reject("User already exits");
            } else {
                add_user(username, password).then(function(add_user_resolve) {
                    console.log(add_user_resolve);
                    resolve("Register successfully");
                }).catch(function(add_user_resolve) {
                    reject(rej)
                })
            }
        }).catch(function(find_user_reject) {
            console.log(find_user_reject);
            add_user(username, password).then(function(add_user_resolve) {
                console.log(add_user_resolve);
                resolve("Register successfully");
            }).catch(function(add_user_resolve) {
                reject(rej)
            })
        });
    });
};
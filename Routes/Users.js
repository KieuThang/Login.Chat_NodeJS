var express = require('express');
var users = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;

users.use(cors());

process.env.SECRET_KEY = "socketchat";

users.post('/register', function (req, res) {
    var today = new Date();
    var appData = {
        "code": 1,
        "data": ""
    };
    var userData = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        "created": today
    }

    database.connection.getConnection(function (err, connection) {
        if (err) {
            appData.code = 1;
            appData.message = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query("SELECT * FROM users WHERE email = ?", [userData.email], function (err, rows, fields) {
                if (err) {
                    appData.code = 1;
                    appData.message = "Error Occurred!";
                    res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                        appData.code = 1;
                        appData.message = "This user already exist!";
                        res.status(200).json(appData);
                    } else {
                        connection.query('INSERT INTO users SET ?', userData, function (err, rows, fields) {
                            if (!err) {
                                connection.query("SELECT * FROM users WHERE email = ?", [userData.email], function (err, rows, fields) {
                                    if (err) {
                                        appData.code = 1;
                                        appData.message = "Error Occurred!";
                                        res.status(400).json(appData);
                                    } else {
                                        appData.code = 0;
                                        appData.message = "User Registered successfully!";
                                        var tokenData = {};
                                        token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                                            expiresIn: 5000
                                        });
                                        tokenData.token = token;
                                        tokenData.isActive = (rows[0].isActive == 1);
                                        tokenData.isDeleted = (rows[0].isDeleted == 1);
                                        appData.data = tokenData;
                                        res.status(200).json(appData);
                                    }
                                });
                            } else {
                                console.log("error:" + err.sqlMessage)
                                appData.code = 1;
                                appData.message = "Error Occured! ";
                                res.status(400).json(appData);
                            }
                        });
                    }
                }
            });
            connection.release();
        }
    });
});

users.post('/login', function (req, res) {
    var appData = {}

    var userData = {
        "email": req.body.email,
        "password": req.body.password
    }

    database.connection.getConnection(function (err, connection) {
        if (err) {
            appData.code = 1;
            appData.data = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query("SELECT * FROM users WHERE email = ?", [userData.email], function (err, rows, fields) {
                if (err) {
                    appData.code = 1;
                    appData.message = "Error Occurred!";
                    res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                        if (rows[0].password == userData.password) {
                            token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                                expiresIn: 5000
                            });
                            appData.code = 0;
                            appData.message = "Success";
                            var tokenData = {};
                            tokenData.token = token;
                            tokenData.isActive = (rows[0].isActive == 1);
                            tokenData.isDeleted = (rows[0].isDeleted == 1);
                            appData.data = tokenData;

                            res.status(200).json(appData);
                        }
                        else {
                            appData.code = 1;
                            appData.message = "Email or password do not match";
                            res.status(200).json(appData);
                        }
                    } else {
                        appData.code = 1;
                        appData.message = "Email does not exists!";
                        res.status(200).json(appData);
                    }
                }
            });
            connection.release();
        }
    });
})

users.use(function (req, res, next) {
    var token = req.body.token || req.headers['token'];
    var appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err) {
            if (err) {
                appData.code = 1;
                appData.message = "Token is invalid";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData.code = 1;
        appData.message = "Please send a token";
        res.status(403).json(appData);
    }
});

users.get('/getUsers', function (req, res) {
    var token = req.body.token || req.header['token'];
    var appData = {};

    database.connection.getConnection(function (err, connection) {
        if (err) {
            appData.code = 1;
            appData.message = "Internal Server Error!";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT * FROM users', function (err, rows, fields) {
                if (err) {
                    appData.code = 1;
                    appData.message = "No data found";
                    res.status(200).json(appData);
                } else {
                    appData.code = 0;
                    appData.data = rows;
                    res.status(200).json(appData);
                }
            });
            connection.release();
        }
    });
});

module.exports = users;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
let ActiveDirectory = require('activedirectory2');

const User = require('../models/user');
var _ = require('underscore');
var query = 'cn=*Exchange*';
var opts = {
    includeMembership: ['group', 'user'], // Optionally can use 'all'
    includeDeleted: false
};

const config = {
    url: 'LDAP://172.16.7.2',
    baseDN: 'DC=Rishabh,DC=com',
    // username: "admin6@rishabh.com",
    // password: "rspl123#"
};
const ad = new ActiveDirectory(config);

module.exports.userLoginWithAD = (req, res, next) => {

    ad.authenticate(req.body.userName + '@rishabh.com', req.body.password, function (err, auth) {
        if (err) {
            console.log(err);
            return res.status(401).json({
                success: false,
                message: 'Authentication Failed'
                //error: err
            });
        }
        if (auth) {
            const token = jwt.sign(
                {
                    userName: req.body.userName
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '5h'
                }
            );
            return res.status(200).json({
                success: true,
                message: 'Authentication Successful',
                userName: req.body.userName,
                token: token
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Authentication Failed'
            });
        }
    });
};

module.exports.findUsers = (req, res, next) => {
    // let username = 'shivani.patel@rishabh.com';
    // ad.userExists(username, function (err, user) {
    //     if (err) {
    //         console.log(err);
    //         return res.status(500).json({
    //             error: err
    //         });
    //     }
    //     if (!user) {
    //         console.log('No users found');
    //         return res.status(200).json({
    //             success: false,
    //             message: 'No users found'
    //         });
    //     }
    //     else {
    //         return res.status(200).json({
    //             success: true,
    //             user: user
    //         });
    //     }
    // });
    // var query = 'cn=*Exchange*';
    ad.findUsers(function (err, users) {
        debugger
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
        if ((!users) || (users.length == 0)) {
            console.log('No users found');
            return res.status(200).json({
                success: false,
                message: 'No users found'
            });
        }
        else {
            console.log('findUsers: ' + JSON.stringify(users));
            return res.status(200).json({
                success: true,
                users: users
            });
        }
    });
};


// EXTRA
module.exports.userLogin = (req, res, next) => {
    User.findOne({ userName: req.body.userName }).exec()
        .then(user => {
            // console.log(user);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication Failed'
                });
            }
            if (user.password === req.body.password) {
                const token = jwt.sign(
                    {
                        userName: user.userName,
                        _id: user._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                return res.status(200).json({
                    success: true,
                    message: 'Authentication Successful',
                    token: token
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication Failed'
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};

module.exports.userGetAll = (req, res, next) => {
    User.find().select('userName').exec()
        .then(user => {
            if (user < 1) {
                return res.status(200).json({
                    success: false,
                    message: 'There are no Users'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    users: user
                    // user.map((result, index, arr) => {
                    //     return result.userName
                    // })
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};
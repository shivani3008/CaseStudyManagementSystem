var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var LoginModel = require('../models/login');

var ActiveDirectory = require('activedirectory');

var config = {
    // url: 'ldap://172.16.7.2:389/dc=rishabh,dc=com',
    url: 'LDAP://172.16.7.2',
    baseDN: 'dc=Rishabh,dc=com'
}

var ad = new ActiveDirectory(config);

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.use(function (req, res, next) {
    // do logging
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

router.get('/login', function (req, res) {

    LoginModel.find(function (err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = { "auth": false, "message": "Error fetching data" };
        } else {
            response = { "auth": true, "message": JSON.stringify(data) };
        }
        res.send(response);
    });

}).post('/login', function (req, res) {
    var loginData = {
        userName: "admin6",
        password: "rspl123#"
    };
    var auth = -1;

    return LoginModel.find().lean().exec(function (err, rec) {

        rec.forEach(function (data, index) {
            if (loginData.userName == data.userName) {
                auth = index
            }
        });

        if (auth > -1) {
            return res.send({ "auth": false, "message": "User already Created" });
        } else {
            LoginModel.create(loginData, function (err, data) {
                if (err) return res.send(err);
                return res.send({ "auth": true, "message": "User created Successfully" });
            });
        }
    });


}).delete('/login/:id', function (req, res) {
    // var id = req.params._id;

    LoginModel.findByIdAndRemove('56a9a492caa3b06c1e633286', function (err, record) {
        if (err)
            return res.send("Unable to delete record err");
        else if (res)
            return res.send("Record deleted Successfully");
        else
            return res.send("Unable to delete te record");
    });
}).get('/login/:id', function (req, res, next) {

    var username = req.query.username + '@rishabh.com';
    var password = req.query.password;

    return ad.authenticate(username, password, function (err, auth) {
        if (err) {
            return res.send({
                "status": "OK",
                "messageCode": 0,
                "message": "Please Enter valid credentials",
                "data": {
                    "auth": "false"
                }
            });
        }

        if (auth) {
            return res.send({
                "status": "OK",
                "messageCode": 0,
                "message": "Returned User Data Information",
                "data": {
                    "auth": "true"
                }
            });
        }
        else {
            return res.send({
                "status": "OK",
                "messageCode": 0,
                "message": "Please Enter valid credentials",
                "data": {
                    "auth": "false"
                }
            });
        }
    });

    //return LoginModel.find().lean().exec(function (err, rec) {

    // if (rec) {
    // rec.forEach(function (data, index) {
    // if (req.query.username == data.userName && req.query.password == data.password) {
    // auth = index
    // }
    // });
    // if (auth > -1) {
    // return res.send({
    // "status": "OK",
    // "messageCode": 0,
    // "message": "Returned User Data Information",
    // "data": {
    // "userData": {
    // "empCode": 123,
    // "username": req.query.username
    // },
    // "auth": "true"
    // }
    // });
    // } else {
    // return res.send({
    // "status": "OK",
    // "messageCode": 0,
    // "message": "Please Enter valid credentials",
    // "data": {
    // "auth": "false"
    // }
    // });
    // }

    // } else {
    // return res.send({
    // "status": "KO",
    // "messageCode": 0,
    // "message": err,
    // "data": {
    // "auth": "false"
    // }
    // });
    // }
    //});

});

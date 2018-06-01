const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UrlCredential = require('../models/urlCredential');
const Project = require('../models/project');

module.exports.getUrlcredentials = (req, res, next) => {
    if (req.body.urlCredentials) {
        if (!Array.isArray(req.body.urlCredentials)) {
            req.body.urlCredentials = JSON.parse(req.body.urlCredentials);
        }
        let arr1 = [];
        const arr = req.body.urlCredentials.map((result, index, a) => {
            const urlCred = new UrlCredential({
                _id: mongoose.Types.ObjectId(),
                url: result.url,
                userName: result.userName,
                password: result.password,
                type: result.type
            });
            urlCred.save()
                .then(ans => {
                    arr1.push(ans._id);
                    req.urlCredentials = arr1;
                    if (arr1.length === req.body.urlCredentials.length) {
                        next();
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: err });
                })
        })
    }
    else {
        next();
    }
};

module.exports.getUpdatedUrlcredentials = async (req, res, next) => {
    try {
        let result = await Project.findById(req.params.id).select('urlCredentials')

        if (result && result.urlCredentials.length > 0) {
            let res = await UrlCredential.remove({ _id: { $in: result.urlCredentials } })
            console.log("All old url removed");
        }
        console.log("0");
        if (req.body.urlCredentials) {
            console.log("01");
            if (!Array.isArray(req.body.urlCredentials)) {
                console.log("02");
                req.body.urlCredentials = JSON.parse(req.body.urlCredentials);
            }
            if (req.body.urlCredentials.length > 0) {
                console.log("04");
                let arr1 = req.body.urlCredentials.map((result) => {
                    try {
                        console.log(11);
                        return new UrlCredential({
                            _id: mongoose.Types.ObjectId(),
                            url: result.url,
                            userName: result.userName,
                            password: result.password,
                            type: result.type
                        });
                        // let ans = await urlCred.save()
                        // return ans._id;
                        // arr1.push(ans._id);
                        // req.urlCredentials = arr1;
                        // if (arr1.length === req.body.urlCredentials.length) {
                        //     console.log(3);
                        //     next();
                        // }
                    } catch (err) {
                        console.log(err);
                        return res.status(500).json({ error: err });
                    }
                });
                console.log(80);
                let ans = await UrlCredential.insertMany(arr1);
                console.log("82:",ans);
                req.urlCredentials = (ans) ? ans.map(curr => {
                    return curr._id;
                }) : [];
                console.log("84:",req.urlCredentials);
                next();
            }
            else {
                console.log(56);
                req.urlCredentials = [];
                next();
            }
        }
        else {
            console.log(4);
            req.urlCredentials = [];
            next();
        }
        console.log(5);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }

};
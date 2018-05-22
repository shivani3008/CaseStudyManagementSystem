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

module.exports.getUpdatedUrlcredentials = (req, res, next) => {
    Project.findById(req.params.id).select('urlCredentials').exec()
        .then(result => {
            if (result && result.urlCredentials.length > 0) {
                UrlCredential.remove({ _id: { $in: result.urlCredentials } })
                    .then(r => console.log("All old url removed"))
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({ error: err });
                    })
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err });
        })

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

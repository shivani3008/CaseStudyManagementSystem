const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ScreenShot = require('../models/screenShot');
const fs = require('fs');
let insertNewScreenShot = (file) => {
    const screenShot = new ScreenShot({
        _id: mongoose.Types.ObjectId(),
        file: file
    });
    return screenShot.save()
};

module.exports.insertScreenShots = (req, res, next) => {
    if (req.files.length > 0) {
        let arr1 = [];
        const arr = req.files.map((file, index, a) => {
            insertNewScreenShot(file)
                .then(result => {
                    arr1.push(result);
                    if (arr1.length === req.files.length) {
                        req.newScreenShots = arr1;
                        next();
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        });
    }
    else {
        req.newScreenShots = [];
        next();
    }
};

module.exports.updateScreenShots = (req, res, next) => {
    if (req.body.deletedScreenShots) {
        if (!Array.isArray(req.body.deletedScreenShots)) {
            req.body.deletedScreenShots = JSON.parse(req.body.deletedScreenShots);
        }
        if (req.body.deletedScreenShots.length > 0) {
            let arryId = req.body.deletedScreenShots.map((curr, i, arr) => {
                return mongoose.Types.ObjectId(curr);
            });
            console.log("ARR:", arryId);
            ScreenShot.find({ _id: { $in: req.body.deletedScreenShots } }).exec()
                .then(r1 => {
                    console.log("RRERR:", r1);
                    r1.map((curr, i, arr) => {
                         console.log(2);
                        fs.unlink(curr.file.path, (err) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ error: err });
                            }
                            console.log(curr.file.path, "All SS from folder have removed");
                        })
                    });
                    console.log(3);
                    ScreenShot.remove({ _id: { $in: req.body.deletedScreenShots } })
                        .then(r => {
                            console.log("All SS from database have removed");
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json({ error: err });
                        });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: err });
                });


        }
    }

    if (req.files.length > 0) {
        let arr1 = [];
        const arr = req.files.map((file, index, a) => {
            insertNewScreenShot(file)
                .then(result => {
                    arr1.push(result);
                    if (arr1.length === req.files.length) {
                        req.newScreenShots = arr1;
                        next();
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        });
    }
    else {
        req.newScreenShots = [];
        next();
    }
};
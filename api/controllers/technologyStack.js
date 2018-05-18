const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TechnologyStack = require('../models/technologyStack');

module.exports.getAllTechStacks = (req, res, next) => {
    TechnologyStack.find({}).select('_id technologyName').exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(200).json({
                    success: false,
                    message: 'TechnologyStacks not found'
                });
            }
            else {
                return res.status(200).json({
                    success: true,
                    technologyStack: result
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

module.exports.insertTechStacks = (req, res, next) => {
    const technologyStack = new TechnologyStack({
        _id: mongoose.Types.ObjectId(),
        technologyName: req.body.technologyName
    });
    technologyStack.save()
        .then(result => {
            res.status(201).json({
                message: "Inserted Successfully",
                technologyStack: {
                    _id: result._id,
                    technologyName: result.technologyName
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
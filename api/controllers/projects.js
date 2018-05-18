const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/project');
const UrlCredential = require('../models/urlCredential');
const TechnologyStack = require('../models/technologyStack');
const screenShot = require('../models/screenShot');
let getProject = (curr) => {
    let obj = {
        _id: curr._id,
        projectName: curr.projectName,
        clientName: curr.clientName,
        technologyStack: curr.technologyStack,
        screenShots: curr.screenShots,
        startDate: new Date(curr.startDate).toString(),
        endDate: new Date(curr.endDate).toString(),
        budgetedHours: curr.budgetedHours,
        consumedHours: curr.consumedHours,
        teamLead: curr.teamLead,
        teamMembers: curr.teamMembers,
        projectManager: curr.projectManager,
        type: curr.type,
        description: curr.description,
        tags: curr.tags,
        userName: curr.userName,
        urlCredentials: curr.urlCredentials,
        createdDateTime: new Date(curr.createdDateTime).toString()
    };
    return obj;
};
let populateArr = [
    {
        path: 'technologyStack',
        model: 'TechnologyStack',
        select: 'technologyName'
    },
    {
        path: 'urlCredentials',
        model: 'UrlCredential',
        select: 'url userName password type'
    },
    {
        path: 'screenShots',
        model: 'ScreenShot',
        select: 'file.path'
    }
];

module.exports.createProject = (req, res, next) => {
    // console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString());
    // console.log("FILE", req.files);
    if (req.body.technologyStack && !Array.isArray(req.body.technologyStack)) {
        req.body.technologyStack = JSON.parse(req.body.technologyStack);
    }
    if (req.body.teamMembers && !Array.isArray(req.body.teamMembers)) {
        req.body.teamMembers = JSON.parse(req.body.teamMembers);
    }
    if (req.body.tags && !Array.isArray(req.body.tags)) {
        req.body.tags = JSON.parse(req.body.tags);
    }
    let project = new Project({
        _id: mongoose.Types.ObjectId(),
        projectName: req.body.projectName,
        clientName: req.body.clientName,
        technologyStack: req.body.technologyStack,
        screenShots: req.newScreenShots.map((result, index, arr) => {
            return result._id;
        }),
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        budgetedHours: req.body.budgetedHours,
        consumedHours: req.body.consumedHours,
        teamLead: req.body.teamLead,
        teamMembers: req.body.teamMembers,
        projectManager: req.body.projectManager,
        type: req.body.type,
        description: req.body.description,
        tags: req.body.tags,
        userName: req.checkAuthUserData.userName,
        urlCredentials: req.urlCredentials
    });
    project.save()
        .then(result1 => {
            req.createdProject = result1;
            res.status(201).json({
                success: true,
                message: "Project Created Successfully",
                createdProject: result1
            });
        })
        .catch(err => {
            console.log(err);
            if (err.name === 'ValidationError') {
                return res.status(422).json({
                    success: false,
                    error: {
                        type: err.name,
                        message: err.message
                    }
                });
            }
            else {
                console.log(err);
                return res.status(500).json({ error: err });
            }
        });
};

module.exports.getAllProjects = (req, res, next) => {
    Project.find({ userName: req.checkAuthUserData.userName }).populate(populateArr).exec()
        //populate('urlCredentials', 'url userName password type').exec()
        .then(project => {
            // console.log(user);
            if (project.length < 1) {
                console.log("Project not found");
                return res.status(200).json({
                    message: 'You have not created any project'
                });
            }
            let myarr = project.map((curr, i, arr) => {
                return {
                    project: getProject(curr)
                }
            });
            res.status(200).json({
                length: project.length,
                projects: myarr
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};

module.exports.getProject = (req, res, next) => {
    Project.findById(req.params.id).populate(populateArr).exec()
        .then(curr => {
            if (!curr) {
                console.log("Project not found");
                return res.status(200).json({
                    message: 'No entry found for provided Project ID'
                });
            }
            res.status(200).json({
                project: getProject(curr)
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};

module.exports.editProject = (req, res, next) => {
    if (req.body.technologyStack && !Array.isArray(req.body.technologyStack)) {
        req.body.technologyStack = JSON.parse(req.body.technologyStack);
    }
    if (req.body.teamMembers && !Array.isArray(req.body.teamMembers)) {
        req.body.teamMembers = JSON.parse(req.body.teamMembers);
    }
    if (req.body.tags && !Array.isArray(req.body.tags)) {
        req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.deletedScreenShots) {
        if (!Array.isArray(req.body.deletedScreenShots)) {
            req.body.deletedScreenShots = JSON.parse(req.body.deletedScreenShots);
        }
        if (req.body.deletedScreenShots.length > 0) {
            Project.update(
                {},
                { $pull: { screenShots: { $in: req.body.deletedScreenShots } } },
                { multi: true }
            ).exec()
                .then(q => {
                    console.log("Some deleted from Project");
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: err });
                });
        }
    }

    if (req.newScreenShots && req.newScreenShots.length > 0) {
        let newScreenShots = req.newScreenShots.map((curr, index, arr) => {
            return curr._id;
        });
        Project.update(
            { _id: req.params.id },
            { $push: { screenShots: { $each: newScreenShots } } }
        ).exec()
            .then(q => {
                console.log("New SS inserted to Project");
            })
            .catch(err => {
                return res.status(500).json({ error: err });
            });
    }
    Project.findById(req.params.id)
        .then(result1 => {
            result1.projectName = req.body.projectName;
            result1.clientName = req.body.clientName;
            result1.technologyStack = req.body.technologyStack;
            // result1.screenShots = req.newScreenShots.map((curr, index, arr) => {
            //         result1.screenShots.push(curr._id);
            //     });
            result1.startDate = req.body.startDate;
            result1.endDate = req.body.endDate;
            result1.budgetedHours = req.body.budgetedHours;
            result1.consumedHours = req.body.consumedHours;
            result1.teamLead = req.body.teamLead;
            result1.teamMembers = req.body.teamMembers;
            result1.projectManager = req.body.projectManager;
            result1.type = req.body.type;
            result1.description = req.body.description;
            result1.tags = req.body.tags;
            result1.urlCredentials = req.urlCredentials;
            return result1.save();
        })
        .then(result1 => {
            Project.findById(req.params.id).populate(populateArr).exec()
                .then(curr => {
                    res.status(201).json({
                        success: true,
                        message: "Project Updated Successfully",
                        project: getProject(curr)
                    });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            if (err.name === 'ValidationError') {
                return res.status(422).json({
                    success: false,
                    error: {
                        type: err.name,
                        message: err.message
                    }
                });
            }
            else {
                console.log(err);
                return res.status(500).json({ error: err });
            }
        });
};

module.exports.editProject_ = (req, res, next) => {
    if (req.body.technologyStack && !Array.isArray(req.body.technologyStack)) {
        req.body.technologyStack = JSON.parse(req.body.technologyStack);
    }
    if (req.body.teamMembers && !Array.isArray(req.body.teamMembers)) {
        req.body.teamMembers = JSON.parse(req.body.teamMembers);
    }
    if (req.body.tags && !Array.isArray(req.body.tags)) {
        req.body.tags = JSON.parse(req.body.tags);
    }
    Project.findByIdAndUpdate(req.params.id, {
        $set: {
            projectName: req.body.projectName,
            clientName: req.body.clientName,
            technologyStack: req.body.technologyStack,
            // screenShots: req.newScreenShots.map((result, index, arr) => {
            //     return result._id;
            // }),
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            budgetedHours: req.body.budgetedHours,
            consumedHours: req.body.consumedHours,
            teamLead: req.body.teamLead,
            teamMembers: req.body.teamMembers,
            projectManager: req.body.projectManager,
            type: req.body.type,
            description: req.body.description,
            tags: req.body.tags,
            urlCredentials: req.urlCredentials
        }
    }).populate(populateArr).exec()
        .then(curr => {
            res.status(201).json({
                success: true,
                message: "Project Updated Successfully",
                project: getProject(curr)
            });
        })
        .catch(err => {
            console.log(err);
            if (err.name === 'ValidationError') {
                return res.status(422).json({
                    success: false,
                    error: {
                        type: err.name,
                        message: err.message
                    }
                });
            }
            else {
                console.log(err);
                return res.status(500).json({ error: err });
            }
        });
};

module.exports.searchProject = (req, res, next) => {
    const searchText = req.body.searchText;
    // Project
    //     .find()
    //     .populate(populateArr)
    //     .find({ $text: { $search: searchText, $caseSensitive: false } })
    //     .exec()
    //     .then(project => {
    //         if (project.length < 1) {
    //             // console.log("Project not found");
    //             return res.status(200).json({
    //                 message: 'No Project found'
    //             });
    //         }
    //         res.status(200).json({
    //             length: project.length,
    //             projects: project
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         return res.status(500).json({
    //             error: err
    //         });
    //     });

    Project
        .find({ $text: { $search: searchText, $caseSensitive: false } }, { score: { $meta: "textScore" } })
        .sort({
            score: { $meta: "textScore" }
        })
        .populate(populateArr)
        .exec()
        .then(project => {
            if (project.length < 1) {
                // console.log("Project not found");
                return res.status(200).json({
                    message: 'No Project found'
                });
            }
            let myarr = project.map((curr, i, arr) => {
                return {
                    project: getProject(curr)
                }
            });
            res.status(200).json({
                length: project.length,
                projects: myarr
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};
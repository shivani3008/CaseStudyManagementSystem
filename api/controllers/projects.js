const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/project');
const UrlCredential = require('../models/urlCredential');
const TechnologyStack = require('../models/technologyStack');
const screenShot = require('../models/screenShot');
const path = require('path');

let getProject = (curr) => {
    let obj = {
        _id: curr._id,
        projectName: curr.projectName,
        clientName: curr.clientName,
        technologyStack: curr.technologyStack,
        screenShots: curr.screenShots.map((current, index, arr) => {
            return {
                _id: current._id,
                originalName: current.file.originalname,
                path: process.env.DOMAIN_NAME + ":" + process.env.PORT + "/" + path.dirname(current.file.path) + '/' + path.basename(current.file.path)
            }
        }),
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
        createdDateTime: new Date(curr.createdDateTime).toString(),
        countryDetails: {
            countryName: curr.countryName,
            latitude: curr.latitude,
            longitude: curr.longitude
        }
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
        select: 'file.path file.originalname'
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

module.exports.createProject_ = (req, res, next) => {
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

module.exports.getAllProjects = async (req, res, next) => {
    try {
        let project = await Project.find().populate(populateArr);
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
        let projectCounts = await Project.aggregate(
            [
                {
                    $group: {
                        _id: "$countryName",
                        projectCount: { $sum: 1 },
                        "latitude": { $first: "$latitude" },
                        "longitude": { $first: "$longitude" }
                    }
                }
            ]
        );
        res.status(200).json({
            length: project.length,
            projects: myarr,
            projectCounts: projectCounts
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
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
            console.log(getProject(curr));
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

module.exports.editProject = async (req, res, next) => {
    try {
        // console.log('BODY', req.body, '\n',req.urlCredentials);
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
                await Project.update(
                    {},
                    { $pull: { screenShots: { $in: req.body.deletedScreenShots } } },
                    { multi: true }
                )
                console.log("Some deleted from Project");
            }
        }

        if (req.newScreenShots && req.newScreenShots.length > 0) {
            let newScreenShots = req.newScreenShots.map((curr, index, arr) => {
                return curr._id;
            });
            await Project.update(
                { _id: req.params.id },
                { $push: { screenShots: { $each: newScreenShots } } }
            );
            console.log("New SS inserted to Project");
        }

        let result1 = await Project.findById(req.params.id);
        if (result1) {
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
            let ans = await result1.save();
            if (ans) {
                let curr = await Project.findById(req.params.id).populate(populateArr);
                res.status(201).json({
                    success: true,
                    message: "Project Updated Successfully",
                    project: getProject(curr)
                });
            }
        }
        else {
            res.status(200).json({
                success: false,
                message: "No entry found for provided Project ID",
            });
        }
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            res.status(422).json({
                success: false,
                error: {
                    type: err.name,
                    message: err.message
                }
            });
        }
        else {
            console.log(err);
            res.status(500).json({ error: err });
        }
    };
};

module.exports.searchProject = (req, res, next) => {
    if (req.body.searchText) {
        const searchText = req.body.searchText;
        let searchTextArr = searchText.split(" ");
        let regex = [];
        for (let i = 0; i < searchTextArr.length; i++) {
            if (searchTextArr[i] != '')
                regex[i] = new RegExp(searchTextArr[i], "i");
        }
        // console.log("searchTextArr", searchTextArr, regex);
        Project.aggregate(
            [
                {
                    $unwind: "$technologyStack"
                },
                {
                    $lookup:
                        {
                            from: "technologystacks",
                            localField: "technologyStack",
                            foreignField: "_id",
                            as: "q"
                        }
                },
                {
                    $unwind: "$q"
                },
                {
                    $match:
                        {
                            $or:
                                [
                                    { "q.technologyName": { $in: regex } },
                                    { "projectName": { $in: regex } },
                                    { "clientName": { $in: regex } },
                                    { "type": { $in: regex } },
                                    { "tags": { $in: regex } }
                                ]
                        }
                },
                {
                    $group: {
                        _id: "$_id"
                    }
                }
            ]
        )
            .then(project => {
                console.log("Project: ", project);
                let arryId1 = project.map((curr, i, arr) => {
                    return mongoose.Types.ObjectId(curr._id);
                });
                return Project.find({ _id: { $in: arryId1 } }).populate(populateArr).exec()
            })
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
    }
    else {
        return res.status(200).json({
            message: 'No Project found'
        });
    }
};


/*
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
*/

/*
module.exports.searchProject_ = (req, res, next) => {

    if (req.body.searchText) {
        console.log(1);
        const searchText = req.body.searchText;
        let searchTextArr = searchText.split(" ");
        let regex = [];
        for (let i = 0; i < searchTextArr.length; i++) {
            if(searchTextArr[i] != '')
                regex[i] = new RegExp(searchTextArr[i], "i");
        }
        console.log("searchTextArr", searchTextArr, regex);
        Project
            .aggregate([
                {
                    $match:
                    {
                        $text: { $search: searchText, $caseSensitive: false }
                    }
                },
                {
                    $sort: { score: { $meta: "textScore" } }
                },
                {
                    $project: { _id: 1 }
                }
            ])
            .then(project => {
                console.log("First: ", project);
                if (project.length < 1) {
                    console.log("Project not found");
                }
                let arryId = project.map((curr, i, arr) => {
                    return mongoose.Types.ObjectId(curr._id);
                });
                Project.aggregate(
                    [
                        {
                            $unwind: "$technologyStack"
                        },
                        {
                            $lookup:
                            {
                                from: "technologystacks",
                                localField: "technologyStack",
                                foreignField: "_id",
                                as: "q"
                            }
                        },
                        {
                            $unwind: "$q"
                        },
                        {
                            $match:
                            {
                                $or:
                                [
                                    { "q.technologyName": { $in: regex } },
                                    { _id: { $in: arryId } }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: "$_id"
                            }
                        }
                    ]
                )
                    .then(project1 => {
                        console.log("Project: ", project1);
                        let arryId1 = project1.map((curr, i, arr) => {
                            return mongoose.Types.ObjectId(curr._id);
                        });
                        return Project.find({ _id: { $in: arryId1 } }).populate(populateArr).exec()
                    })
                    .then(project1 => {
                        if (project1.length < 1) {
                            // console.log("Project not found");
                            return res.status(200).json({
                                message: 'No Project found'
                            });
                        }
                        res.status(200).json({
                            length: project1.length,
                            projects: project1
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
                return res.status(500).json({
                    error: err
                });
            });
    }
    else {
        console.log(2);
        return res.status(200).json({
            message: 'No Project found'
        });
    }
};
*/

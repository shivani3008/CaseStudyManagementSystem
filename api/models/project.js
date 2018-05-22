const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    projectName: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    technologyStack: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'TechnologyStack',
        required: true
    },
    screenShots: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ScreenShot',
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    budgetedHours: {
        type: Number
    },
    consumedHours: {
        type: Number
    },
    teamLead: {
        type: String
    },
    teamMembers: {
        type: [String]
    },
    projectManager: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    urlCredentials: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'UrlCredential'
    },
    tags: {
        type: [String]
    },
    userName: {
        type: String,
        required: true
    },
    createdDateTime: {
        type: Date,
        required: true,
        default: new Date()
    }
});
// projectSchema.path('projectName').validate((value) => {
//     return value != null;
// });
projectSchema.index({'projectName': 'text', 'tags': 'text', 'type': 'text', 'clientName': 'text', 'technologyStack': 'text'});
module.exports = mongoose.model('Project', projectSchema);
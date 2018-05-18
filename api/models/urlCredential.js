const mongoose = require('mongoose');
const urlCredentialSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    }
});
module.exports = mongoose.model('UrlCredential', urlCredentialSchema);
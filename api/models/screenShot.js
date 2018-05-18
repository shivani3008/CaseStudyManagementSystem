const mongoose = require('mongoose');

const screenShotSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    file: {
        type: Object,
        required: true
    }
});
module.exports = mongoose.model('ScreenShot', screenShotSchema);
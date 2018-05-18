const mongoose = require('mongoose');
const techStackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    technologyName: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('TechnologyStack', techStackSchema);
const mongoose = require('mongoose')

const houseSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
        maxlength:50
    },
    city: {
        type: String,
        required: true,
        maxlength:50
    },
    state: {
        type: String,
        required: true,
        maxlength:20
    },
    cep: {
        type: String,
        required: false,
        maxlength:20
    },
    owner: {type: mongoose.Types.ObjectId, ref: 'Owner'}
});

module.exports = mongoose.model('House', houseSchema);
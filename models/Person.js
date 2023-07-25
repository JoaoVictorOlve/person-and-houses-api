const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    age: {
        type: Number,
        required: true,
        maxlength: 3
    },
    houses: [{  type: mongoose.Types.ObjectId,
                ref: 'House',
                required: false}]
});

module.exports = mongoose.model('Person', personSchema);
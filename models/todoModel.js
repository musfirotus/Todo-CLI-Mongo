const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    _id: Number,
    item: String,
    cek: {
        type: Boolean,
        default: false
    }
}, {collection: 'todomodels'});

module.exports = mongoose.model('todoModel', todoSchema);
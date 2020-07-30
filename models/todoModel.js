const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    item: String,
    cek: String
})

module.exports = mongoose.model('todoModel', todoSchema);
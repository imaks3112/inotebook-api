const mongoos = require('mongoose');

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    tag: {
        type: String,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoos.model('notes', NotesSchema);
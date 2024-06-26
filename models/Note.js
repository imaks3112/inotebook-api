const mongoos = require('mongoose');
const { Schema } = mongoos;

const NotesSchema = new Schema({
    user: {
        type: mongoos.Schema.Types.ObjectId,
        ref: 'user'
    },
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
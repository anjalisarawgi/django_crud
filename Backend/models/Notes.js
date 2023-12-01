const mongoose = require('mongoose');

// schema format follows this: https://mongoosejs.com/docs/guide.html

const NotesSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    describe:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default: "General"
    }, 
    timestamp:{
        type: Date,
        default: Default.now
    }
});

module.exports=mongoose.model('notes', NotesSchema)
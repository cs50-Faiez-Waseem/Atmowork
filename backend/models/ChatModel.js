const mongo = require('mongoose');

const ChatSchema = new mongo.Schema({
    message: {
        type: String,
        min: [2, 'Minimum message Length is 2 required!!'],
        required: [true, 'Message  is Required']
    },
    project_id: {
        type: mongo.Types.ObjectId,
        ref: 'projects',
        required: [true, 'ProjectId is Required!!']
    },
    creatorid: {
        type: mongo.Types.ObjectId,
        ref: 'user',
        required: [true, 'Creator is Required!!']
    },
    files : {
        type: Array,
        default: []
    },
})

ChatSchema.set('timestamps', true)



const Chat = mongo.model('chats', ChatSchema);
module.exports = Chat
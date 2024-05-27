const mongo = require('mongoose')
const InviteSchema = new mongo.Schema({
  
    inviteCode : {
        type : String,
        unique : true,
        required : true,
    },
    inviteSender_id: {
        type: mongo.Types.ObjectId,
        ref: 'user',
        required: [true, 'Member id is Required!']
    },
    inviteProject_id: {
        type: mongo.Types.ObjectId,
        ref: 'projects',
        required: [true, 'Project id is Required!']
    },
    inviteEmail : {
        type : String,
        required : true
    },
    status : {
        type: String,
        enum: {
            values: ['pending', 'approved', 'canceled'],
            message: '{VALUE} is not supported'
        },
        default: 'pending'
    }
    
})

InviteSchema.set('timestamps', true)

const Invites = mongo.model('invites', InviteSchema);
module.exports = Invites
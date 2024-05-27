const mongo = require('mongoose')
const MemberSchema = new mongo.Schema({
  
    member_id: {
        type: mongo.Types.ObjectId,
        ref: 'user',
        required: [true, 'Member id is Required!']
    },
    project_id: {
        type: mongo.Types.ObjectId,
        ref: 'projects',
        required: [true, 'Project id is Required!']
    },
    
})

MemberSchema.set('timestamps', true)

const Members = mongo.model('members', MemberSchema);
module.exports = Members
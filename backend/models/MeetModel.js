
const mongo = require('mongoose')

const MeetSchema = new mongo.Schema({
    userid : {
        type : mongo.Types.ObjectId,
        ref : 'user',
        required : [true , 'Userid is Required!!']
    },
    meetCode: {
     type : String,
     required : [true , 'MeetCode is Required']
    },
    start_time : {
        type : Date,
        required : [true , 'Start Time is Required']
    },
})
MeetSchema.set('timestamps', true)


const Meet = mongo.model('meets', MeetSchema);
module.exports = Meet
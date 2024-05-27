
const mongo = require('mongoose')

const GoalTaskSchema = new mongo.Schema({
    userid : {
        type : mongo.Types.ObjectId,
        ref : 'user',
        required : [true , 'Userid is Required!!']
    },
    goalid : {
        type : mongo.Types.ObjectId,
        ref : 'goals',
        required : [true , 'GoalId is Required!!']
    },
    title: {
     type : String,
     min : [6 , 'Minimum Goal Title Length is 6 required!!'],
     required : [true , 'Goal Title is Required']
    },
    description : {
        type :  String,
    },
    status: {
        type: String,
        enum: { 
            values : ['inprogress', 'completed'],
            message: '{VALUE} is not supported'
        },
        default: 'inprogress'
    },
    deadline : {
        type : Date,
        default : Date.now,
    }
})
GoalTaskSchema.set('timestamps', true)


const GoalTask = mongo.model('goaltask', GoalTaskSchema);
module.exports = GoalTask
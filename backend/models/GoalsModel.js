
const mongo = require('mongoose')

const GoalsSchema = new mongo.Schema({
    userid : {
        type : mongo.Types.ObjectId,
        ref : 'user',
        required : [true , 'Userid is Required!!. Goal Creator Id Required.']
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
            values : ['inprogress', 'Completed'],
            message: '{VALUE} is not supported'
        },
        default: 'inprogress'
    },
    progress : {
        type : mongo.SchemaTypes.Mixed,
        default : 0,
        max : 100
    },
    targets : {
        type : Number,
        default : 0,
    },
    project_id : {
        type : mongo.Types.ObjectId,
        ref : 'project'
    }
})
GoalsSchema.set('timestamps', true)


const Goals = mongo.model('goals', GoalsSchema);
module.exports = Goals
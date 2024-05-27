const mongo = require('mongoose')
const ProjectSchema = new mongo.Schema({
    title: {
        type: String,
        min: [6, 'Minimum Project Title Length is 6 required!!'],
        required: [true, 'Project Title is Required']
    },
    description: {
        type: String,
    },
    creatorid: {
        type: mongo.Types.ObjectId,
        ref: 'user',
        required: [true, 'Creator is Required!!. Project Creator Id Required.']
    },
    space_used: {
        type: Number,
        default: 0,
    },
    members: [{
        type: mongo.Types.ObjectId,
        ref: 'user',
    }],
    features: [{
        type : mongo.Types.ObjectId,
        ref : 'features',
    }],
    start_date : {
        type : Date,
    },
    end_date : {
        type : Date
    }
})

ProjectSchema.set('timestamps', true)

const Project = mongo.model('projects', ProjectSchema);
module.exports = Project
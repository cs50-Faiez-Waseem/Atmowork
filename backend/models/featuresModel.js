const mongo = require('mongoose');
const ProjectModel = require('./ProjectModel')

const FeaturesSchema = new mongo.Schema({
    title: {
     type : String,
     min : [6 , 'Minimum Feature Title Length is 6 required!!'],
     required : [true , 'Feature Title is Required']
    },
    description : {
        type :  String,
    },
    project_id : {
        type : mongo.Types.ObjectId,
        ref : 'projects',
        required : [true , 'ProjectId is Required!!']
    },
    creatorid : {
        type : mongo.Types.ObjectId,
        ref : 'user',
        required : [true , 'Creator is Required!!']
    },
    assigned : {
        type : mongo.Types.ObjectId,
        ref : 'user',
    },
    status : {
        type : String,
        enum : ['todo','inprogress','review','done'],
        default : 'todo',
    },
    start_date : {
        type : Date,
    },
    end_date : {
        type : Date
    },
    assigned : {
        type : mongo.Types.ObjectId,
        ref : 'user',
        default: function() {
            return this.creatorid;
        }
    },
})

FeaturesSchema.set('timestamps', true)

FeaturesSchema.post('save' ,async function(){
   const project = await ProjectModel.findById(this.project_id);
   project.features.push(this._id);
   project.save()
})

const Feature = mongo.model('features', FeaturesSchema);
module.exports = Feature
const mongo = require('mongoose');

const MindMapSchema = new mongo.Schema({
    title: {
        type: String,
        min: [6, 'Minimum MindMap Title Length is 6 required!!'],
        required: [true, 'MindMap Title is Required']
    },
    thumbnail :{
        type : String,
        default : 'https://res.cloudinary.com/monday-blogs/w_1999,h_1414,c_fit/fl_lossy,f_auto,q_auto/wp-blog/2021/03/Mind-map-example.jpg'
    },
    creatorid: {
        type: mongo.Types.ObjectId,
        ref: 'user',
        required: [true, 'Creator is Required!!']
    },
    data: {
        type: mongo.Schema.Types.Mixed, // Use the Mixed type for storing arbitrary JSON-like data
        required: true
    }
})


const MindMap = mongo.model('mindmaps', MindMapSchema);
module.exports = MindMap
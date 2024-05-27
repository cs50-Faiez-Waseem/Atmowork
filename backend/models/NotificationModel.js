const mongo = require('mongoose')

const NotiSchema = new mongo.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    user : {
        type : mongo.Types.ObjectId,
        ref : 'user',
        required : [true , 'Userid is Required!!. Goal Creator Id Required.']
    }
})
NotiSchema.set('timestamps', true)

const notification = mongo.model('notifications', NotiSchema);
module.exports = notification;
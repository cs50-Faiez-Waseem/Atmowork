const mongo = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongo.Schema({
    username: {
        type: String,
        min: [6, "Username is Too Short!! . Minimum 6 length required"],
        required: true
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
            },
            message: props => `${props.value} is not a valid Email Address`
        },
        min: [8, "Email Length is Too Short!!.Minimum length 8 is Required"],
        required: [true, "Email is  Required"]
    },
    password: {
        type: String,
        min: [8, 'Password Length is too Short!!. Minimum length 8 is Required.'],
        required: true
    },
    account_membership: {
        type: String,
        enum: {
            values: ['Freemium', 'Hobby', 'Standard', 'Premium'],
            message: '{VALUE} is not supported'
        },
        default: 'Freemium'
    },
    account_type: {
        type: String,
        enum: {
            values: ['INDIVIDUAL', 'TEAM', 'MEMBER'],
            message: '{VALUE} is not supported'
        },
        default: 'INDIVIDUAL'
    },
    membership_plan_id: {
        type: mongo.Types.ObjectId,
        ref: 'member_ship'
    },
    profile_pic : {
        type : String,
        default : 'https://placehold.co/100x100?text=No+Profile',
        required : false
    }
})
UserSchema.set('timestamps', true)

UserSchema.pre('save' ,async function(){
    this.password = await bcrypt.hash(this.password, 10);
})


const User = mongo.model('user', UserSchema);
module.exports = User;
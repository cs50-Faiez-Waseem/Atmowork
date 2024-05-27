const mongo = require('mongoose')

const MemberShipSchema = new mongo.Schema({
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    extend_date: {
        type: Date,
    },
    plan: {
        type: String,
        enum: {
            values: ['Hobby', 'Standard', 'Premium'],
            message : '{VALUE} is not a valid Plan'

        },
        default: 'Hobby'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        required: [true, 'Amount is Required!!'],
    },
    receipt_url: {
        type: String,
        required: [true , 'Reciept is Required']
    }
})
MemberShipSchema.set('timestamps', true)


const MemberShip = mongo.model('member_ship', MemberShipSchema);
module.exports = MemberShip;
const MeetModel = require('../models/MeetModel')
const utils = require('../utils/queries/index')
class MeetController {

    createMeet = async (req, res) => {
        try {
            if (await utils.canCreateMeet(req)) {
                const { meetCode, start_time } = req.body
                const meet = await MeetModel.create({
                    userid: req.user,
                    meetCode,
                    start_time
                })
                res.json({ status: true, meet })
            }else{
                res.json({ status: false, message : 'Cannot Create Meet on Hobby Account' })
            }

        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    getMeet = async (req, res) => {
        try {
            const meet = await MeetModel.findOne({ meetCode: req.params.id })
            res.json({ status: true, meet })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    updateMeet = async (req, res) => {
        try {
            // const { start_time  , meetCode} = req.body
            // const meet = await MeetModel.find( { meetCode }, {
            //     $set : {
            //         start_time
            //      }
            // })
            // res.json({ status : true  , meet})

        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
}


module.exports = new MeetController()
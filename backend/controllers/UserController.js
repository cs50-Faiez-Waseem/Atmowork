const UserModel = require('../models/UserModel')
const ProjectModel = require('../models/ProjectModel')
const GoalsModel = require('../models/GoalsModel')
const NotificationModel = require('../models/NotificationModel')

class UserController {

    async getMe(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.user }, { password: 0 })
                .populate('membership_plan_id');
            const existingProjectsCount = await ProjectModel.countDocuments({ creatorid: req.user });
            const existingGoalsCount = await GoalsModel.countDocuments({ userid: req.user });

            const latestProjects = await ProjectModel.find({ creatorid: req.user }).sort({ createdAt: -1 }).limit(3);
            const latestGoals = await GoalsModel.find({ userid: req.user }).sort({ createdAt: -1 }).limit(3);

            res.json({
                status: true,
                user,
                total_goals: existingGoalsCount,
                total_projects: existingProjectsCount,
                latestProjects,
                latestGoals
            })

        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }

    async updateMe(req, res) {
        try {
            const { username , email , profile_pic } = req.body;
            const user = await UserModel.findOneAndUpdate({ _id: req.user }, {
                $set: {
                  username,
                  email,
                  profile_pic
                }})
              res.json({ status : true  , user})
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }

    }

    async getAllNotifications(req, res){
        try {
            const notifications = await NotificationModel.find({ user: req.user }).sort({ createdAt: -1 }).limit(10);
            res.json({
                status: true,
                notifications
            })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }
}   

module.exports = new UserController()
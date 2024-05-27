const GoalsModel = require('../models/GoalsModel')
const GoalTaskModel = require('../models/GoalTaskModel')


class GoalController {
    async getGoals(req, res) {
        try {
            const goals = await GoalsModel.find({ userid: req.user }).sort('created_at');
            res.json({
                status: true,
                goals
            })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }
    async getGoal(req, res) {
        try {
            const goal = await GoalsModel.findById(req.params.id)
            const tasks = await GoalTaskModel.find({ goalid: req.params.id })
            res.json({
                status: true,
                goal,
                tasks
            })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }
    async createGoal(req, res) {
        try {
            console.log(req.body)
            const goal = await GoalsModel.create({
                title: req.body.title,
                description: req.body.description,
                userid: req.user,
            })
            res.json({
                status: true,
                goal
            })

        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }
    async updateGoal(req, res) {
        try {
            console.log(req.user)
        } catch (error) {

        }
    }
    async deleteGoal(req, res) {
        try {
            const result = await GoalsModel.deleteOne({ _id: req.params.id, userid: req.user });
            console.log(result)
            res.json({
                status: result.deletedCount ? true : false,
                message: result.deletedCount ? 'Goal Deleted' : 'Failed To Delete'
            })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }

    async createTask(req, res) {
        try {
            const task = await GoalTaskModel.create({
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline,
                status: req.body.status,
                userid: req.user,
                goalid: req.params.id,
            })
            await GoalsModel.findByIdAndUpdate(req.params.id, { $inc: { targets: 1 } });
            res.json({
                status: true,
                task
            })
        } catch (err) {
            res.json({
                status: false,
                message: err.message
            })
        }
    }
    async updateTask(req, res) {
        try {
            const task = await GoalTaskModel.findByIdAndUpdate(req.params.id, req.body)
            const { status } = req.body

            if(status === 'completed') {
                await GoalsModel.findByIdAndUpdate(task.goalid, { $inc: { progress: 1 } });
            }

            res.json({
                status: true,
                task
            })
        } catch (err) {
            res.json({
                status: false,
                message: err.message
            })
        }
    }
    async deleteTask(req, res) {
        try {
            const goal = await GoalTaskModel.findById(req.params.id)
            await GoalsModel.findByIdAndUpdate(goal.goalid, { $inc: { targets: -1 } });

            await goal.deleteOne()

            res.json({
                status: true,
                message:'Task Deleted'
            })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    } 
}

module.exports = new GoalController()
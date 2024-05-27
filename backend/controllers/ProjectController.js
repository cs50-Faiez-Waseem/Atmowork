const ProjectModel = require('../models/ProjectModel')
const FeatureModel = require('../models/featuresModel')
const UserModel = require('../models/UserModel')

const utils = require('../utils/queries/index')

let plansFeature = {
    'Hobby': {
        projects: 10,
        team: 0
    },
    'Standard': {
        projects: 10,
        team: 5
    },
    'Premium': {
        projects: 50,
        team: -1
    },
}

class ProjectController {



    async getProjects(req, res) {
        try {
            const projectsCreatedByUser = await ProjectModel.find({ creatorid: req.user })
                .populate(['creatorid', 'members', 'features'])
                .sort('asc');

            const projectsWhereUserIsMember = await ProjectModel.find({ members: req.user })
                .populate(['creatorid', 'members', 'features'])
                .sort('asc');



            const mergedProjects = projectsCreatedByUser.concat(projectsWhereUserIsMember);
            res.json({ status: true, projects: mergedProjects })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    async getProject(req, res) {
        try {
            const { id } = req.params;
            const projectCreatedByUser = await ProjectModel.findById(id)
                .populate([
                {
                    path: 'creatorid',
                    select: '-password -membership_plan_id -account_membership -createdAt -updatedAt -account_type'
                },
                {
                    path: 'members',
                    select: '-password -membership_plan_id -account_membership -createdAt -updatedAt -account_type'
                }]);
            res.json({ status: true, project: projectCreatedByUser })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    async createProject(req, res) {
        try {
            if (await utils.hasExceededProjectCreateLimit(req)) {
                res.json({ status: false, message: `You have reached the maximum number of allowed projects on Your PLAN. please upgrade to premium plan to add more projects.` });
            } else {
                const project = await ProjectModel.create({ ...req.body, creatorid: req.user });
                res.json({ status: true, project });
            }
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    async updateProject(req, res) {

    }
    async deleteProject(req, res) {
        try {
            const result = await ProjectModel.deleteOne({ _id: req.params.id, creatorid: req.user });
            console.log(result)
            res.json({
                status: result.deletedCount ? true : false,
                message: result.deletedCount ? 'Project Deleted' : 'Failed To Delete.Only Project Owners Can Delete Projects'
            })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }

    async createFeature(req, res) {
        try {
            const feature = await FeatureModel.create({ ...req.body, creatorid: req.user });
            res.json({ status: true, feature })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }
    async getFeatures(req, res) {
        try {
            const features = await FeatureModel.find({ project_id: req.params.projectid }).populate( [ 'creatorid' , 'assigned'] )
            res.json({ status: true, features })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }
    async updateFeature(req, res) {
        try {
            const response = await FeatureModel.updateOne({ _id: req.params.id }, { $set: req.body }, { new: true });
            console.log(response);
            res.json({ status: !!response.modifiedCount , message: 'updated ', response })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    async deleteFeature(req, res) {
        try {
            const result = await FeatureModel.deleteOne({ _id: req.params.id, creatorid: req.user });
            console.log(result)
            res.json({
                status: result.deletedCount ? true : false,
                message: result.deletedCount ? 'Feature Deleted' : 'Failed To Delete'
            })
        } catch (error) {
            res.json({
                status: false,
                message: error.message
            })
        }
    }

}

module.exports = new ProjectController();
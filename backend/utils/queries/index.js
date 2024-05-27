

const Project = require('../../models/ProjectModel')
const User = require('../../models/UserModel')

let plansFeature = {
    'Hobby': {
        projects: 10,
        team: 0,
        live : false,
    },
    'Standard': {
        projects: 10,
        team: 5,
        live : false,
    },
    'Premium': {
        projects: 50,
        team: -1,
        live : true
    },
}


exports.hasExceededProjectCreateLimit = async (req) => {
    try {
        const user = await User.findOne({ _id: req.user }, { password: 0 }).populate('membership_plan_id');
        if (user) {
            const total_allowed_project = plansFeature[user.account_membership].projects;

            const existingProjectsCount = await Project.countDocuments({ creatorid: req.user });

            console.log({ total_allowed_project, existingProjectsCount })

            if (existingProjectsCount >= total_allowed_project) {
                return true
            } else {
                return false;
            }
        }
    } catch (error) {
        return false;
    }
}
exports.canCreateMeet = async (req) => {
    try {
        const user = await User.findOne({ _id: req.user }, { password: 0 }).populate('membership_plan_id');
        if (user) {
            return plansFeature[user.account_membership].live;
        }else{
            return false;
        }
    } catch (error) {
        return false;
    }
}
exports.hasExceededProjectMemberLimit = async (req, projectId) => {
    try {
        const user = await User.findOne({ _id: req.user }, { password: 0 }).populate('membership_plan_id');
        if (user) {
            const total_allowed_project = plansFeature[user.account_membership].team;

            const project = await Project.findById(projectId)
            if (project) {
                const existingProjectsCount = project.members.length;
                if (total_allowed_project  === -1) {
                    return false;
                }
                if (existingProjectsCount >= total_allowed_project) {
                    return true
                } else {
                    return false;
                }
            } else {
                return false
            }
        }
    } catch (error) {
        return false;
    }
}
const router = require('express').Router()
const UserController  = require('../controllers/UserController')
const GoalController = require('../controllers/GoalController')
const ProjectController = require('../controllers/ProjectController')
const InviteController = require('../controllers/InviteController')
const MindMapController = require('../controllers/MindMapController')
const MeetController = require('../controllers/MeetController')

const verifyToken = require('../middleware/authMiddleware')

router.get('/' , verifyToken , UserController.getMe)
router.put('/' , verifyToken , UserController.updateMe)
router.get('/notifications' , verifyToken , UserController.getAllNotifications)


// Goals
router.get('/goals' , verifyToken , GoalController.getGoals)
router.get('/goal/:id' , verifyToken , GoalController.getGoal)
router.post('/goal' , verifyToken , GoalController.createGoal)
router.put('/goal' , verifyToken , GoalController.updateGoal)
router.delete('/goal/:id' , verifyToken , GoalController.deleteGoal)
router.post('/goal/:id/task' , verifyToken , GoalController.createTask)
router.put('/goal/task/:id' , verifyToken , GoalController.updateTask)
router.delete('/goal/task/:id' , verifyToken , GoalController.deleteTask)



//Project
router.get('/projects', verifyToken , ProjectController.getProjects)
router.get('/project/:id' , verifyToken , ProjectController.getProject)
router.post('/project' , verifyToken , ProjectController.createProject)
router.put('/project' , verifyToken , ProjectController.updateProject)
router.delete('/project/:id' , verifyToken , ProjectController.deleteProject)


// Invite To Project
router.get('/project/invite/:code',  InviteController.getInvitationEmail)
router.post('/project/:id/invite', verifyToken, InviteController.inviteUserToProject)
router.post('/project/invite/:code', verifyToken, InviteController.completeInvitaion)

//features (Project Tasks)
router.get('/features/:projectid', verifyToken , ProjectController.getFeatures)
router.post('/feature', verifyToken , ProjectController.createFeature)
router.put('/feature/:id', verifyToken , ProjectController.updateFeature)
router.delete('/feature/:id', verifyToken , ProjectController.deleteFeature)

// MindMap
router.get('/mindmaps', verifyToken , MindMapController.getAll)
router.get('/mindmap/:id', verifyToken , MindMapController.get)
router.post('/mindmap', verifyToken , MindMapController.createOne)
router.put('/mindmap/:id', verifyToken , MindMapController.updateOne)
router.delete('/mindmap/:id', verifyToken , MindMapController.removeOne)


// Meet 
router.get('/meet/:id', verifyToken , MeetController.getMeet)
router.post('/meet', verifyToken , MeetController.createMeet)

module.exports = router
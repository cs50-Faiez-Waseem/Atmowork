const router = require('express').Router()
const ChatController = require('../controllers/ChatController')
const verifyToken = require('../middleware/authMiddleware')


module.exports = (io) => {

    
    router.get('/messages/:chatid', verifyToken, ChatController.getMessages)
    router.post('/message/:chatid', verifyToken, (req,res)=> ChatController.addMessage(req,res,io))
    
    router.delete('/message/:messageid', verifyToken, (req , res) => ChatController.removeMessage(req,res,io))
    
    
    return router
}


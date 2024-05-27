const ProjectModel = require('../models/ProjectModel');
const User = require('../models/UserModel');
const InvitesModel = require('../models/inviteModel')
const sendMail = require('../utils/mail')
const crypto = require('crypto')
const utils = require('../utils/queries/index')

const NotificationModel = require('../models/NotificationModel')

class InviteController {
    async inviteUserToProject(req, res) {
        try {

            const { id } = req.params;
            const { email } = req.body
            const userId = req.user

            if (!email) {
                return res.json({
                    status: false,
                    message: 'To Send Invitation To Project Provide an Email'
                })
            }

            if (!id) {
                return res.json({
                    status: false,
                    message: 'Invalid Id Provided'
                })
            }

            if (!userId) {
                return res.json({
                    status: false,
                    message: 'Invalid User Id'
                })
            }


            const isProjectOwner = await ProjectModel.findOne({
                creatorid: userId
            }).populate('creatorid')


            
            
            if (!isProjectOwner) {
                return res.json({
                    status: false,
                    message: 'Only Project Owner Can add new Members'
                })
            }
            
            if(await utils.hasExceededProjectMemberLimit(req, isProjectOwner._id)){
                return res.json({
                    status: false,
                    message: 'You have exceeded the maximum number of members allowed for a project. Please upgrade to a premium account.'
                })
            }

            const isAlreadyInvited = await InvitesModel.findOne({
                inviteEmail: email,
                inviteProject_id: id,
                inviteSender_id: userId
            })

            if (isAlreadyInvited) {
                return res.json({
                    status: false,
                    message: 'Invitation Already Sended!'
                })
            }
           


            const uniqueCode = crypto.randomBytes(8).toString('hex');

            console.log(uniqueCode)

            await InvitesModel.create({
                inviteCode: uniqueCode,
                inviteProject_id: id,
                inviteSender_id: userId,
                inviteEmail: email
            })

            await NotificationModel.create({
                user: userId,
                title: `${isProjectOwner?.creatorid?.username} project invitation is Sent`,
                description : `${isProjectOwner?.creatorid?.username} you will be informed once accepted by ${email}`,
            })

            sendMail(email, 'Project Invitation | ATMOWORK', `
                  <!DOCTYPE html>
                  <html>
                  <head>
                  <title>Invitation Email</title>
                  <style>
                      body {
                      font-family: Arial, sans-serif;
                      }
      
                      .container {
                      max-width: 500px;
                      margin: 0 auto;
                      padding: 20px;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                      }
      
                      h2 {
                      text-align: center;
                      }
      
                      .btn {
                      display: inline-block;
                      background-color: #4CAF50;
                      color: white;
                      padding: 10px 20px;
                      text-decoration: none;
                      border-radius: 5px;
                      }
                  </style>
                  </head>
                  <body>
                  <div class="container">
                      <h2>Project Invitation</h2>
                      <p>Dear ${email},</p>
                      <p>You are Invited By ${isProjectOwner?.creatorid?.username || ''}. To Work on a Project together.</p>
                      <p>Click the Link Below To Join. Please click the button below to log in:</p>
                      <p>
                      <a class="btn" href="${process.env.APP_URL}signin?inviteCode=${uniqueCode}&projectid=${id}&dt=${new Date().toISOString()}">Approve</a>
                      </p>
                      <p>Thank you for choosing our platform. If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
                      <p>Best regards,<br/>ATMOWORK Team</p>
                  </div>
                  </body>
                  </html>
          
          `)

            return res.json({
                status: true,
                message: 'Invitaion Sent!!'
            })
        } catch (error) {
            return res.json({
                status: false,
                message: 'Server Error'
            })
        }
    }
    async completeInvitaion(req, res) {

        try {
            const { code } = req.params

            const userId = req.user

            const { status } = req.body

            if (!code) {
                return res.json({
                    status: false,
                    message: 'Invite Code Invalid'
                })
            }

            if (!status) {
                return res.json({
                    status: false,
                    message: 'Status Not Found!!'
                })
            }

            const user = await User.findById(userId)

            if (!user) {
                return res.json({
                    status: false,
                    message: 'Invalid User. Please SignIn from valid Account'
                })
            }


            const inviteCopy = await InvitesModel.findOne({
                inviteCode: code,
                inviteEmail: user.email
            })

            inviteCopy.status = status

             

            if (!inviteCopy) {
                return res.json({
                    status: false,
                    message: 'Cannot Find Any Invitation'
                })
            }

            const project = await ProjectModel.findById(inviteCopy.inviteProject_id);
            const projectOwner = await User.findById(project.creatorid)
            
            if(status === 'approved'){
                
                const isAlreadyAMember = project.members.includes(userId)

                await NotificationModel.create({
                    user: project.creatorid,
                    title: 'Invite Accepted', 
                    description :  ` ${projectOwner.username} Your Project Invitation is Accepted By ${user.username}`,
                })
                
                if (isAlreadyAMember) {
                    return res.json({
                        status: false,
                        message: 'Already a Member'
                    })
                }
            }

            project.members.push(userId);
            project.save();

            inviteCopy.save()
            


            sendMail(projectOwner.email, `Invitation ${status}`, `
            <div>
              <h1>Dear ${projectOwner.username},</h1>
              <p>Your Invitaion To ${user.username} was ${status} .</p>
            </div>
            `)
            sendMail(user.email, `Invitation ${status}`, `
            <div>
              <h1>Dear ${user.username},</h1>
              <p>${status === 'approved' ? 'You are Added To Project Team' : 'You are Not Added To Project Team'}.</p>
            </div>
            `)

            return res.json({
                status: true,
                message: status === 'approved' ? 'Congrats You are Added To Be a Member' : 'You are Not Added To Project Team'
            })

        } catch (error) {
            return res.json({
                status: false,
                message: error.message
            })
        }
    }
    async getInvitationEmail(req, res) {
        try {
            const { code } = req.params;
            const inviteCopy = await InvitesModel.findOne({ inviteCode: code }).populate(['inviteSender_id','inviteProject_id'])

            if(!inviteCopy){
                return res.json({
                    status: false,
                    message : 'Invalid Code'
                })
            }

            return res.json({
                status: true,
                data: {
                    email: inviteCopy.inviteEmail,
                    invite : inviteCopy
                }
            })

        } catch (error) {
            return res.json({
                status: true,
                message: error.message
            })

        }
    }
}

module.exports = new InviteController()
const UserModel = require('../models/UserModel')
const MemberShipModel = require('../models/MemberShipModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const stripe = require('stripe')(process.env.STRIPE_BK)
const { v4: uuidv4 } = require('uuid')
const sendMail = require('../utils/mail')

let plansFeature = {
    'Hobby' : ['upto 10 projects','kanban Model & MindMapping','300mb/project'],
    'Standard' : ['includes every thing from Hobby Project','Add Team Member upto 5','Enjoy Free Meet Sessions Upto an Hour'],
    'Premium' : ['includes everything from Standard Project','upto 50 Projects','500mb/project file storage'],
}

class AuthController {

    expiresIn30days = 2592000000;

    async register(req, res) {
        try {
            console.log(req.body)
            const isExist = await UserModel.findOne({ email: req?.body?.email });
            if (isExist) {
                res.json({ message: 'Email Already Exist', "success": false, })
            }

            const user = await UserModel.create(req.body);
            const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
            console.log(token)
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
                maxAge: 2592000000
            });
            sendMail(req?.body?.email, `ATMOWORK | new Account Created`, `
            <!DOCTYPE html>
                <html>
                <head>
                <title>Registration Complete Email</title>
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
                    <h2>Registration Complete</h2>
                    <p>Dear ${req?.body?.username},</p>
                    <p>Congratulations! Your registration on ATMOWORK is now complete.</p>
                    <p>You can now access your account and enjoy all the features we offer. Please click the button below to log in:</p>
                    <p>
                    <a class="btn" href="${process.env.APP_URL}signin">Login Now</a>
                    </p>
                    <p>Thank you for choosing our platform. If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
                    <p>Best regards,<br/>ATMOWORK Team</p>
                </div>
                </body>
                </html>
            `)
            res
                .status(201)
                .json({ message: "User signed in successfully", success: true, user });

        } catch (error) {
            res.status(404).json({ message: error.message, "success": false })
        }

    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.json({ message: 'All fields are required', success: false, })
            }
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.json({ message: 'Email Doesn`t Exists', success: false, })
            }
            const auth = await bcrypt.compare(password, user.password)
            if (!auth) {
                return res.json({ message: 'Incorrect password or email', success: false, })
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
                maxAge: 2592000000
            });
            sendMail(email, `ATMOWORK | new login detected`, `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Login Success</title>
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
                <h2>Account Logged In</h2>
                <p>Dear ${user.username},</p>
                <p>This email is to inform you that your account was recently accessed.</p>
                <p>If you recognize this activity, no further action is required. However, if you did not initiate this login, please contact our support team immediately.</p>
                <p>If you need to access your account, please click the button below:</p>
                <p>
                <a class="btn" href="${process.env.APP_URL}signin">Login Now</a>
                </p>
                <p>Best regards,<br/>AtmoWork Team</p>
              </div>
            </body>
            </html>`)
            res.status(201).json({ message: "User logged in successfully", success: true, user });
        } catch (error) {
            res.status(201).json({ message: "User login Failed " + error.message, success: false });
        }
    }
    async pay(req, res) {
        const plans = { 'Hobby': process.env.Hobby, 'Standard': process.env.Standard, 'Premium': process.env.Premium };
        const { plan, token, email } = req.body;
        console.log('pay wall requested')
        const vKey = uuidv4()
        return stripe.customers.create({
            email: token.email,
            source: token
        }).then(customer => {
            return stripe.charges.create({
                amount: plans[plan] * 100,
                currency: 'usd',
                customer: customer.id,
                receipt_email: token.email
            }, { idempotencyKey: vKey })
                .then(async (result) => {
                    console.log(result)
                    const start_date = new Date();
                    start_date.setMonth(start_date.getMonth() + 1);
                    const end_date = start_date;

                    const memberShip = await MemberShipModel.create({
                        start_date: new Date(),
                        end_date: end_date,
                        isPaid: result.paid,
                        amount: result.amount / 100,
                        plan: plan,
                        receipt_url: result.receipt_url,
                    })
                    const User = await UserModel.updateOne({ email: email }, {
                        $set: {
                            account_membership: plan,
                            membership_plan_id: memberShip._id
                        }
                    })
                    sendMail(req?.body?.email, `ATMOWORK | Account Upgraded to ${plan}`, `
                      <!DOCTYPE html>
                        <html>
                        <head>
                        <title>Payment Successful Email</title>
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
                            ul {
                            padding-left: 20px;
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h2>Payment Successful</h2>
                            <p>Dear ${email},</p>
                            <p>Thank you for purchasing our plan. We are pleased to inform you that your payment has been successfully processed.</p>
                            <p style="font-weight: 600;" >PLAN : ${plan}</p>
                            <p style="font-weight: bold;" >CHARGES : ${plans[plan]}$/m</p>
                            <p style="font-weight: bold;" >FEATURES :</p>
                            <ul>
                            ${plansFeature[plan].map(i => `<li>${i}</li>` )}
                            </ul>
                            <p>You now have access to all the premium features included in your chosen plan. To start exploring, please log in to your account:</p>
                            <p>
                            <a class="btn" href="${process.env.APP_URL}signin">Login Now</a>
                            </p>
                            <a class="btn" href="${result.receipt_url}">Reciept</a>
                            <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!</p>
                            <p>Thank you for choosing our services.</p>
                            <p>Best regards,<br/>ATMOWORK Team</p>
                        </div>
                        </body>
                        </html>
                      `)
                    res.status(200).json({
                        status: result.status,
                        receipt_url: result.receipt_url,
                        paid: result.paid,
                        email: result.source.name,
                        amount: result.amount / 100,
                        User
                    })
                })
        }).catch(err => console.log(err))
    }
    async logOut(req, res) {
        try {
            res.clearCookie('token');
            res.json({ message: 'Logged Out', status: true })

        } catch (error) {
            res.json({ message: 'LogOut Failed', status: false })
        }
    }
}

module.exports = new AuthController()
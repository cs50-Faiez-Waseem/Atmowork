// const axios = require('axios')
const nodemailer = require("nodemailer");


async function sendMail(to , subject , body){

  const transporter =  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_GMAIL_USER,
      pass: process.env.SMTP_GMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "atmo@work.com",
    to: to,
    subject: subject,
    html: body,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error" + error);
      return;
    } else {
      console.log("Email sent:" + info.response);
      // res.json({ status: 201, info });
    }
  });

  // axios.post(process.env.MAIL_URL+`&email=${to}&subject=${subject}&msg=${body}`)
  // .then(res => console.log(res.data))
  // .catch(err => console.log(err))
}
module.exports = sendMail



const nodemailer = require('nodemailer');
const {google}  = require('googleapis');


  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
  oAuth2Client.setCredentials({refresh_token: process.env.GMAIL_REFRESH_TOKEN});
  
  const sendEmail = async (to,subj,msg)=>{
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service:"gmail",
      auth:{
        type:"OAuth2",
        user: process.env.GMAIL_USERNAME,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken:accessToken 
      },
      tls: {
        rejectUnauthorized: true,
      }
    })

  const from = process.env.GMAIL_USERNAME;

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject:subj, to,text: msg }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });

  }

  
  
  module.exports = sendEmail;
  



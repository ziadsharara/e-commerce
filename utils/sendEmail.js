import nodemailer from 'nodemailer';

const sendEmail = async options => {
  // 1) Create transporter (service that will send email like: "Gmail", "Mailgun", "Mailtrap", "SendGrid")
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // if secure false => port = 587, if secure true => port = 465
    secure: true,
    auth: {
      user: 'ziad.shararaa@gmail.com',
    },
  });
  // 2) Define email options (like from, to, subject, email content)
  // 3) Send email
};

export default sendEmail;

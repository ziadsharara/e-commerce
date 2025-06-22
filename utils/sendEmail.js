import nodemailer from 'nodemailer';

const sendEmail = async options => {
  // 1) Create transporter (service that will send email like: "Gmail", "Mailgun", "Mailtrap", "SendGrid")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false => port = 587, if secure true => port = 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOptions = {
    from: 'Happy-Shop App <ziadehab.dev@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;

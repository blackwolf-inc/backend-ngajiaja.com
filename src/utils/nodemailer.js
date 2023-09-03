const nodemailer = require('nodemailer');
const ejs = require('ejs');

class Nodemailer {
  static sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `Admin <${process.env.EMAIL_ACCOUNT}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  static getHtml = (fileName, data) => {
    return new Promise((resolve, reject) => {
      const path = `${process.cwd()}/src/views/email/${fileName}`;

      ejs.renderFile(path, data, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  };
}

module.exports = Nodemailer;

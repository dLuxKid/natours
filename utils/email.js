const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.host_port,
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  await transporter.sendMail({
    from: "dLuxKid <adetunjiboyz09@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.text,
  });
};

module.exports = sendEmail;

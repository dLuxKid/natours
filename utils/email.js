const nodemailer = require("nodemailer");
const pug = require("pug");
// const htmlToText = require("html-to-text");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = "Adetunji Marvellous <adetunjimarvellous09@gmail.com>";
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.host,
      port: process.env.host_port,
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to natours");
  }

  async resetPassword() {
    await this.send(
      "passwordReset",
      "YOUR PASSWORD RESET TOKEN (Valid for 10 minutes)"
    );
  }
}

module.exports = Email;

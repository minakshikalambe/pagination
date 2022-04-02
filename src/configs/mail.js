const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  secure: false, 
  auth: {
    user: "4e2eb56d9764aa", 
    pass: "b0d5e42a5462b5", 
  },
});
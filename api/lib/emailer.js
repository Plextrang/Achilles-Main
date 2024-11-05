const nodemailer = require('nodemailer');
const { testSMTPConnection } = require('./testConnection');
async function sendEmail(productName, recipientEmail) {
    try {
        console.log("This is from the sendEmail function!");
        console.log("productName: ", productName);
        console.log("recipientEmail: ", recipientEmail);
        await testSMTPConnection();
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'achillesemail67@gmail.com',
                //pass: 'AchillesAdmin1!'
                pass: 'ualm ggwh fqdp vdbd'
            }
        });
        transporter.verify(function(error, success) {
            if (error) {
                  console.log(error);
            } else {
                  console.log('Server is ready to take our messages');
            }
        });
        let mailOptions = {
            from: 'achillesemail67@gmail.com',
            to: recipientEmail,
            subject: 'Low Stock Alert',
            text: `Product ${productName} is low on stock.`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmail }
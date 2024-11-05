const net = require('net');

async function testSMTPConnection() {
    const gmailSMTPServer = 'smtp.gmail.com';
    const port = 465;

    const socket = net.createConnection({ host: gmailSMTPServer, port: port });

    socket.on('connect', () => {
        console.log('Connection to SMTP server successful.');
        socket.end();
    });

    socket.on('error', (error) => {
        console.error('Error connecting to SMTP server:', error);
    });
}

// Call the function to test SMTP connection
module.exports = {testSMTPConnection}
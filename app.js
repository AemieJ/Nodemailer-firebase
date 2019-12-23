const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const nodemailer = require('nodemailer');

const app = express();  
const port = 3000 || process.env.port;
const username = require("./id.json").username;
const password = require("./id.json").password;

// Add middleware setup for handlebars
app.engine('handlebars', expressHandlebars({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

// Setup for static pages 
app.use('/public', express.static(path.join(__dirname, 'public')));

// Setup for Body Parser 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', (request, response)=>{
    response.render('contact');
});

app.post('/send', (request, response)=>{
    const toMail = request.body.email;
    const output = `
        <p> Contact Details </p>
        <ul>
            <li> Name : ${request.body.name} </li>
            <li> Company : ${request.body.company} </li>
            <li> Email : ${request.body.email} </li>
            <li> Phone : ${request.body.phone} </li>
        </ul>
        <p> ${request.body.message} </p>
    `; 
 
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
        ciphers:'SSLv3'
        },
        auth: {
            user: username,
            pass: password
        }
    });
    let mailOptions = {
        from: `"Aemie Jariwala" ${username}`, // sender address
        to: `${toMail}`, // list of receivers
        subject: "Test email", // Subject line
        text: "Hello world", // plain text body
        html: output // html body
    };

    transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.error(error);
        }

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        response.render('confirmation');
    });


});

app.listen(port, ()=> console.log(`Server connected at ${port}`));
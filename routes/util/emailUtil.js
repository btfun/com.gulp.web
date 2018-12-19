var nodemailer = require('nodemailer');
var stripJsonComments = require('strip-json-comments');
var path = require('path');
var fs= require('fs');


var emailObj={};
try{
    var json = fs.readFileSync(path.resolve(__dirname, '../../conf/email.json'),'utf8').toString();
    emailObj=JSON.parse(stripJsonComments(json));
}catch(e){
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,'email.json error:'+ e);
}

var transporter = nodemailer.createTransport({
    host: emailObj.host,
    port: emailObj.port,
    secure: false, // use SSL
    auth: {
        user: emailObj.user,
        pass: emailObj.pass
    }
});


exports.sendMail=function(obj){
    var mailOptions = {
        from: '"saas.web 👥" <'+emailObj.from+'>', // sender address
        to: emailObj.receivers.join(', '), // list of receivers
        subject: obj.subject,              // Subject line
        text: obj.text,                    // plaintext body
        html: '<span>'+obj.text+'</span>'  // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });


}
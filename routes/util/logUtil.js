var bunyan = require('bunyan');
var os = require('os');
var path = require('path');

function getIPAdress(){
    var interfaces = os.networkInterfaces();
    for(var devName in interfaces){
          var iface = interfaces[devName];
          for(var i=0;i<iface.length;i++){
               var alias = iface[i];
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                     return alias.address;
               }
          }
    }
}

var log = bunyan.createLogger({
  name: "saas.beauty.web",
  hostname: getIPAdress(),
  streams: [
    // {
    //    type: 'rotating-file',
    //    path: path.resolve(__dirname, '../../logger/beauty.web.log'),
    //    level: 'warn',
    //    period: '1d',   // daily rotation
    //    count: 3        // keep 3 back copies
    // }
  ],
  // level: "debug",
  serializers: {
        req:function(req){
          return {
              method: req.method,
              url: req.url,
              headers: req.headers
          }
        }
    }
});







exports.logger = log;

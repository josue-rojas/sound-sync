const express = require('express');
const parser = require('body-parser');
const fs = require("fs");
const dns = require('dns');
const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 8080;
const HOSTNAME = require('os').hostname();
let server_ip = null; //set later with dns lookup

app.use(express.static('public/'));
app.use(parser.json());
app.set('view engine', 'ejs');

dns.lookup(HOSTNAME, (err, result)=> {
  server_ip = result;
});

// https://gist.github.com/qiao/1626318 modified to get ipv4
function getClientIp(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
    if (ipAddress.substr(0, 7) == "::ffff:") {
      ipAddress = ipAddress.substr(7)
    }
  }
  return ipAddress;
};

app.get('/', (req, res)=>{
  const clientIP = getClientIp(req);
  // should render different pages
  if(clientIP == server_ip){
    res.render('pages/index', {ip: (clientIP)});
  }
  else {
    res.render('pages/index', {ip: clientIP});
  }
});


server.listen(PORT, ()=>{
  console.log(`listening on port ${PORT}`);
  console.log(`Stream at ${HOSTNAME}:${PORT}`);
});

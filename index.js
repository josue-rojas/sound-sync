const express = require('express');
const parser = require('body-parser');
const dns = require('dns');
const fs = require('fs')
const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 8080;
const HOSTNAME = require('os').hostname();
const io = require('socket.io')(server);
let server_ip = null; //set later with dns lookup

app.use(express.static('public/'));
app.use(parser.json());
app.set('view engine', 'ejs');

dns.lookup(HOSTNAME, (err, result)=> {
  server_ip = result;
});


// iTunes XML, TODO: change to let user choose songs, or xml libraries
const $HOME = process.env.HOME || '';
const XML = `${$HOME}/Music/iTunes/iTunes\ Music\ Library.xml`;
const iTunes_XML_Parser = require('./modules/itunesxml');
let iTunes_XML = new iTunes_XML_Parser.itunes_xml(XML);
let music_data =  iTunes_XML.getSongs();
let curr_song_id = -1;

// TODO: thinking of seperating the ip stuff into a module and in that it should handle if ips match (just to reduce code here and make it more clear)
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

// TODO should do pagination for when there is  alot of songs so it would be smoother in the browser (especially the styling)
app.get('/', (req, res)=>{
  const clientIP = getClientIp(req);
  if(clientIP === server_ip || clientIP === '::1'){
    res.render('pages/index_host', {ip: clientIP, songs: music_data});
  }
  else {
    res.render('pages/index_client', {ip: clientIP, songs: music_data});
  }
});

app.get('/stream_page', (req, res)=>{
  const clientIP = getClientIp(req);
  res.render('pages/index_client', {ip: clientIP});
});

// endpoint to get current streamed song
app.get('/stream', (req, res)=>{
  if(curr_song_id == -1) return
  const path = music_data[curr_song_id]['Location'].substring(7).replace(/%20/g, ' ');
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  // console.log((range || 'not'));
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/*',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/*',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }

});

// socket.io on
io.on('connection', (socket)=>{
  // change song
  socket.on('change song', (id)=>{
    curr_song_id = id;
    socket.broadcast.emit('song change');
  })
});


server.listen(PORT, ()=>{
  console.log(`listening on port ${PORT}`);
  console.log(`Stream at ${HOSTNAME}:${PORT}`);
});

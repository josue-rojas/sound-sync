// inspired by https://github.com/daspinola/video-stream-sample (basically modified to fit my needs)
const fs = require('fs');

class Stream {
  constructor(path){
    this.path = path;
    this.stat = fs.stateSync(path);
  }
  getSize(){
    return this.stat.size || -1;
  }
  // same as the fs pipe but this function creates the readStream and pipe
  pipe(range={}, res){
    const readStream =  fs.createReadStream(this.path, range);
    return readStream.pipe(res)
  }
  changePath(newPath){
    this.path = newPath;
    this.stat = fs.stateSync(newPath);
  }
}

module.exports.Stream = Stream;

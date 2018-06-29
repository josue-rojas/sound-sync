const fs = require("fs");
const xml2js = require('xml2js').parseString;

// if i know what type the key is then i can iterate through the list given and find the locations, this way the order is given by the array given by the parser, this is to go around the idea that not every key exist in every song (for this to work perfectly if a key that is not here will break it)
// if more exist just add them (try to keep it sorted the way it appears, although it doesnt matter)
const ITUNES_XML_TYPES = {
  "Track ID": "integer",
  "Size": "integer",
  "Total Time": "integer",
  "Stop Time": "integer", //might have start time (i probably never used it...)
  "Disc Number": "integer",
  "Disc Count": "integer",
  "Track Number": "integer",
  "Track Count": "integer",
  "Year": "integer",
  "BPM": "integer",
  "Date Modified": "date",
  "Date Added": "date",
  "Bit Rate": "integer",
  "Sample Rate": "integer",
  "Part Of Gapless Album": "true", // bool...
  "Volume Adjustment": "integer",
  "Play Count": "integer",
  "Play Date": "integer",
  "Play Date UTC": "date",
  "Skip Count": "integer",
  "Skip Date": "date",
  "Release Date": "date",
  "Compilation": "true", // just says true, must be a boolean but i dont see false
  "Artwork Count": "integer",
  "Season": "integer",
  "Episode Order": "integer",
  "Persistent ID": "string",
  "Explicit": "true", // another bool
  "Track Type": "string",
  "Podcast": "true", // bool
  "Movie": "true",
  "Has Video": "true",
  "Unplayed": "true", // bool
  "Purchased": "true", // bool
  "TV Show": "true",
  "Disabled": "true",  // just says true, must be a boolean but i dont see false
  "File Type": "integer",
  "File Folder Count": "integer",
  "Library Folder Count": "integer",
  "Name": "string",
  "Artist": "string",
  "Album Artist": "string",
  "Composer": "string",
  "Album": "string",
  "Genre": "string",
  "Kind": "string",
  "Comments": "string",
  "Sort Name": "string",
  "Sort Album": "string",
  "Sort Artist": "string",
  "Sort Album Artist": "string",
  "Sort Series": "string",
  "Sort Composer": "string",
  "Content Rating": "string",
  "Series": "string",
  "Episode": "string",
  "Work": "string",
  "Location": "string"
}

// TODO: class should have method to sort by artist, album, etc
// TODO: need to check if file exist or is right one
// TODO: remove videos, and anything else that is not music (maybe file type can help)
class itunes_xml {
  constructor(location){
    this.location = location;
    let songs_object = [];
    this.songs = [];
    let $this = this
    // fileSync might be fine here (or not), but when changing the file and reading the new one should be async
    let data = fs.readFileSync(location);
    xml2js(data, {explicitArray: false, preserveChildrenOrder: true}, function(err, result) {
      const songsXML = result.plist.dict.dict.dict;
      for(let i = 0; i < songsXML.length; i++){
        let keys = songsXML[i].key;
        // in here i am making a song object that contains all it's info that it can be provided by the keys
        let songOBJ = {};
        let typeCurr = {
          "string": 0,
          "integer": 0,
          "date": 0,
          // "true": 0 // booleans are true or they dont exist (false), positions shouldnt change
        }
        // TODO: songOBJ should be 1928: {} where the number represesnts the Track ID for faster access and sorting purposes
        for(let j = 0; j < keys.length; j++){
          // first look up the type the key is
          const keyType = ITUNES_XML_TYPES[keys[j]];
          // if it is a bool it must be true cause that is the only option if it exist
          if(keyType === "true"){
            songOBJ[keys[j]] = true;
          }
          // else get the value from its array
          else{
            songOBJ[keys[j]] = songsXML[i][keyType][typeCurr[keyType]];
            // and finally update the curr position for the type
            typeCurr[keyType] += 1;
          }
        }
        songs_object.push(songOBJ);
      }
      $this.songs = songs_object;
    });
    // console.log('hello',this.songs);
  }


  getSongs(){
    return this.songs;
  }

}

// const a = new itunes_xml(`${$HOME}/Music/iTunes/iTunes\ Music\ Library.xml`)


module.exports.itunes_xml = itunes_xml;

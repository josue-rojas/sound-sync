const socket = io();
// const this_id = Math.random();

$( document ).ready(function() {
  const audio = document.getElementById('audio');
  let isPause = true;

  function playSong(pause){
    if(pause){
      audio.play();
    }
    else {
      audio.pause();
    }
    return !pause;
  }

  socket.on('song change', (song)=>{
    const $current_playing_title = $('.current_playing_title');
    const $current_playing_artist = $('.current_playing_artist');
    $current_playing_title.text(song['Name']);
    $current_playing_artist.text(song['Artist']);
    audio.load();
  })

  // click pause and play
  // TODO: this is where it should get or start to get the times to sync the playtime
  let i = 0;
  $('.controls .pause').click(()=>{
    isPause = playSong(isPause);
    i=0;
  });

  socket.on('pause song', (pause)=>{
    isPause = playSong(pause);
  });
  // let i = 0;
  socket.on('audio time', (song_time, curr_time)=>{
    let timeLapse = new Date() - new Date(curr_time);
    // console.log(song_time)
    timeLapse /= 1000;
    // console.log(timeLapse+.001)
    // // get seconds
    // var seconds = Math.round(timeLapse);
    // console.log(seconds + " seconds");
    // const difference = audio.currentTime-(song_time+timeLapse )

    if(i == 0 && !isPause){
      // console.log('change time')
      audio.currentTime = song_time+timeLapse;
      i++;
    }
    // audio.currentTime = song_time;

    // console.log(difference);
    // if(difference > .5 || difference < -1){
    //   audio.currentTime = song_time;
    //   console.log('change time')
    //   // audio.currentTime = song_time;
    // }
  });

})

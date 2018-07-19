const socket = io();
const this_id = Math.random();

$( document ).ready(function() {
  const audio = document.getElementById('audio');
  let isPause = true;
  let songTimer = null;

  function playSong(pause){
    if(pause){
      audio.play();
      // TODO set timer user configurable along with other options (pagination, etc)
      songTimer = setInterval(()=>{
        console.log('timer');
        socket.emit('audio time', audio.currentTime, new Date());
      }, 1000)
    }
    else {
      audio.pause();
      clearTimeout(songTimer);
    }
    return !pause;
  }

  // switch song
  $('.song').click((event)=>{
    let $song = $(event.target).closest('.song');
    const $current_playing_title = $('.current_playing_title');
    const $current_playing_artist = $('.current_playing_artist');
    $current_playing_title.text($song.data('name'));
    $current_playing_artist.text($song.data('artist'));
    // socket notification to switch all songs through the server using the id
    socket.emit('change song', $song.data('id'));
    audio.load();
    // when load it starts to play, if not (havent checked other browsers besides safari) then start playing
    isPause = playSong(true);;
  })

  // --------------------------------------
  // click events for custom buttons
  $('.controls .prev').click(()=>{

  })

  $('.controls .next').click(()=>{

  })

  // TODO: important to solve later
  // TODO: the stream should stop if the one host pauses (if there are 2 host connected then it should continue playing if at least one is playing), probably just limit how many host pages there can be.
  $('.controls .pause').click(()=>{
    socket.emit('pause play', isPause);
    isPause = playSong(isPause);
  });

  // --------------------------------------
  // socket stuff
  // this is to change song when the there is another host that changes the song
  socket.on('song change', (song)=>{
    const $current_playing_title = $('.current_playing_title');
    const $current_playing_artist = $('.current_playing_artist');
    $current_playing_title.text(song['Name']);
    $current_playing_artist.text(song['Artist']);
    audio.load();
  })

  socket.on('pause play', (pause)=>{
    isPause = playSong(pause);
  })

  // TODO emit when song ends so .load happens in the other side or should be handled when syncing times
});

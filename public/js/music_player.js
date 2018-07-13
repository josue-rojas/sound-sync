const socket = io();
const this_id = Math.random();

$( document ).ready(function() {
  const audio = document.getElementById('audio');
  // document.getElementById('audio').play();
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
  })

  socket.on('song change', ()=>{
    audio.load();
  })

  // TODO emit when song ends so .load happens in the other side or should be handled when syncing times
});

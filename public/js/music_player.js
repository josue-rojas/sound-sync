$( document ).ready(function() {
  // switch song 
  $('.song').click((event)=>{
    let $song = $(event.target).closest('.song');
    const $current_playing_title = $('.current_playing_title');
    const $current_playing_artist = $('.current_playing_artist');
    $current_playing_title.text($song.data('name'));
    $current_playing_artist.text($song.data('artist'));
  })
});

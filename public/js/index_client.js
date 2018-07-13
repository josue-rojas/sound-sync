const socket = io();
// const this_id = Math.random();

$( document ).ready(function() {

  socket.on('song change', ()=>{
    console.log('changed song')
    const audio = document.getElementById('audio');

    // reload the stream to match the change
    // audio.src = '/stream';
    document.getElementById('audio_src').src = '/stream';
    audio.load();
    // audio.play();
    // document.getElementById('audio').load();
  })

})

var loaded_clips = [],
	nowPlaying;

function ready(clips) {
	loaded_clips = clips;

	// Get a random video ID out of the array 'clips' and store it in the variable 'nowPlaying'
	nowPlaying = clips[Math.floor(Math.random() * clips.length)];
	var startSeconds = Math.random() * nowPlaying.duration - 7;
	var endSeconds = startSeconds + 6;

	document.getElementById('player').style.display = 'block';

	player.loadVideoById({
		videoId: nowPlaying.id,
		startSeconds: startSeconds,
		endSeconds: endSeconds
	})
    player.playVideo();
}


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        playerVars: {'autoplay': 1, 'controls': 0, 'showinfo': 0},
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
    	nowPlaying = loaded_clips[Math.floor(Math.random() * loaded_clips.length)];
    	var startSeconds = Math.random() * nowPlaying.duration - 7;
		var endSeconds = startSeconds + 6;
		player.loadVideoById({
			videoId: nowPlaying.id,
			startSeconds: startSeconds,
			endSeconds: endSeconds
		})
	    player.playVideo();
    }
}

function stopVideo() {
    player.stopVideo();
}


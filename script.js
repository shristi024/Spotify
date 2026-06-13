const playlists = {
    Enhypen: {
        name: "Enhypen",
        image: "Enhypen.jfif",
        songs: [
            { title: "XO 'Only If you say yes'", artist: "Enhypen", src: "songs/Enhypen/XO.mp3", cover: "Enhypen.jfif" },
            { title: "Polaroid", artist: "Enhypen", src: "songs/enhypen/Polaroid.mp3", cover: "Enhypen.jfif" }
        ]
    },
    kpop: {
        name: "Kpop",
        image: "Kpop.jfif",
        songs: [
            { title: "Replay-SHINee", artist: "SHINee", src: "songs/kpop/Replay-SHINee.mp3", cover: "Kpop.jfif" }
        ]
    },
    Punjabi: {
        name: "Punjabi",
        image: "Punjabi.png",
        songs: [
            {title:"Ud-daa Punjaab", artist: "Vishal dadlani & Amit trivedi", src:"songs/Punjabi/Ud-daa Punjab.mp3", cover:"Punjabi.png"}
        ]
    }
}

// current song tracking
let currentAudio = null;
let currentSongIndex = 0;
let currentPlaylist = null;

// open playlist
function openPlaylist(playlistName) {
    currentPlaylist = playlists[playlistName];

    // hide main songs div, show playlist page
    document.querySelector('.songs').style.display = 'none';
    document.getElementById('playlist-page').style.display = 'flex';

    // set playlist title
    document.getElementById('playlist-title').textContent = currentPlaylist.name;

    // build song list
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';  // clear previous songs

    currentPlaylist.songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');
        songItem.innerHTML = `
            <img src="${song.cover}">
            <div>
                <p>${song.title}</p>
                <p style="color: #aaa; font-size: 12px">${song.artist}</p>
            </div>
        `;
        songItem.onclick = () => playSong(index);
        songList.appendChild(songItem);
    });
}

// go back to main page
function goBack() {
    document.querySelector('.songs').style.display = 'flex';
    document.getElementById('playlist-page').style.display = 'none';
}

// play song
function playSong(index) {
    if (currentAudio) {
        currentAudio.pause();
    }

    currentSongIndex = index;
    const song = currentPlaylist.songs[index];

    currentAudio = new Audio(song.src);
    currentAudio.play();

    // update song player UI
    document.querySelector('.song-player img').src = song.cover;
    document.querySelector('.song-info').innerHTML = `
        <p>Playlist- ${currentPlaylist.name}</p>
        <p>Artist- ${song.artist}</p>
        <p>Song- ${song.title}</p>
    `;

    // update progress bar
    currentAudio.addEventListener('timeupdate', () => {
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        document.getElementById('myprogressbar').value = progress;
    });

    // auto play next song
    currentAudio.addEventListener('ended', () => {
        nextSong();
    });

    // highlight playing song
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('playing');
    });
    document.querySelectorAll('.song-item')[index].classList.add('playing');
}

// next song
function nextSong() {
    if (currentPlaylist && currentSongIndex < currentPlaylist.songs.length - 1) {
        playSong(currentSongIndex + 1);
    }
}

// previous song
function prevSong() {
    if (currentPlaylist && currentSongIndex > 0) {
        playSong(currentSongIndex - 1);
    }
}

// play/pause button
document.querySelector('.player img:nth-child(2)').addEventListener('click', () => {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
    }
});

// previous button
document.querySelector('.player img:nth-child(1)').addEventListener('click', prevSong);

// next button
document.querySelector('.player img:nth-child(3)').addEventListener('click', nextSong);

// progress bar seek
document.getElementById('myprogressbar').addEventListener('input', () => {
    if (currentAudio) {
        const seekTime = (document.getElementById('myprogressbar').value / 100) * currentAudio.duration;
        currentAudio.currentTime = seekTime;
    }
});
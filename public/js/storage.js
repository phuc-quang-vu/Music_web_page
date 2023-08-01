if (localStorage.length <= 1) 
    localStorage.setItem('nextPost',1)
else 
    populatePlaylist()

function showPlaylist() {
    //build a table to hold the playlist 
    let str = '<h3>Playlist</h3>'
    str += buildTbl(playlist, button2)

    const playlistDiv = document.getElementById('playlist')
    playlistDiv.innerHTML = str
}

function moveSong(trackId, index, step) {
//step = -1 move up, 1 move down

    //check boundary
    if ((step == -1 && index <= 0) || (step == 1 && index >= playlist.length - 1)) return

    //get songs from storage
    const song1 = getSong(trackId, Object.values(localStorage), true)
    const song2 = getSong(playlist[index+step].trackId, Object.values(localStorage), true)

    //swap the two's position
    const tmp = song1.position
    song1.position = song2.position
    song2.position = tmp

    //update storage
    localStorage.setItem('song'+song1.trackId,JSON.stringify(song1))
    localStorage.setItem('song'+song2.trackId,JSON.stringify(song2))

    populatePlaylist()
}

function removeSong(trackId ) {
    localStorage.removeItem('song' + trackId)
    populatePlaylist()
}

function addSong(trackId) {
    //add a song to local storage if it does not exist
    if (getSong(trackId, Object.values(localStorage), true)) return

    //get song from song list
    const song = getSong(trackId,songs)
    song.position = Number(localStorage.getItem('nextPost'))
    localStorage.setItem('song' + trackId, JSON.stringify(song))

    //increase next position
    localStorage.setItem('nextPost',song.position + 1)

    //(re)populate and display playlist
    populatePlaylist()
}
    
function populatePlaylist() {
//populate playlist from local storage

    playlist.length = 0 // clear existing songs

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if(key.slice(0,4)==='song') {
            const song = JSON.parse(localStorage.getItem(key))
            playlist.push(song)
        }
    }

    playlist.sort((song1, song2) => {
        return song1.position - song2.position
    })

    showPlaylist()
}



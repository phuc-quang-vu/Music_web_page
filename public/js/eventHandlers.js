const ENTER = 13
function handleKeyUp(event) {
    event.preventDefault()
    if (event.keyCode === ENTER) {
        document.getElementById("submit_button").click()
    }
}

function handleSonglistButtons(event) {
    event.stopPropagation()
    if (event.target.textContent === PLUS) {
        addSong(Number(event.target.id))
    }
}

function handlePlaylistButtons(event) {
    event.stopPropagation()
    const trackId = Number(event.target.id)
    const idx = Number(event.target.dataset.idx)
    switch (event.target.textContent) {
        case MINUS: removeSong(trackId); break;
        case UP: moveSong(trackId,idx,-1); break;
        case DOWN: moveSong(trackId,idx,1); break;
        default: break;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submit_button').addEventListener('click', getSongs)
    document.addEventListener('keyup', handleKeyUp)
    document.getElementById('playlist').addEventListener('click',handlePlaylistButtons)
    document.getElementById('songlist').addEventListener('click',handleSonglistButtons)
})


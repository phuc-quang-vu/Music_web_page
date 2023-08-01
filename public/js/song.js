const songs = []
const playlist = []
const PLUS = '\u2795', MINUS = '\u2796', UP = String.fromCodePoint(0x1F53C), DOWN = String.fromCodePoint(0x1F53D)
const button1 = [PLUS]
const button2 = [MINUS, UP, DOWN]

function getSong(trackId, songList, convert = false) {
//get a song from song list by trackId
console.log("song list: ", songList)
    for (let song of songList) {
        console.log("song: ", song)
        if (convert) song = JSON.parse(song)
        if (song.trackId === trackId) return song
    }
    return null
}

function showSongs() {
    // build a table to hold the song list
    let str = `<h3>Songs matching: ${document.getElementById('songTitle').value}</h3>`
    str += buildTbl(songs, button1)

    // add to songDiv
    const songDiv = document.getElementById('songDiv')
    songDiv.innerHTML = str
}

function getSongs() {
    const songTitle = document.getElementById('songTitle').value
    if (songTitle === '') {
        return alert('Please enter a song title')
    }

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            parse(xhr.responseText)
            showSongs()
        }
    }
    xhr.open('GET', `/songs?title=${songTitle}`, true)
    xhr.send()
}

function parse(responseText) {
//parse the responseText to an array of song objects
//songs with track name !== songTitle will be excluded
//return: [{trackId, title, collection, artist, artwork},...] or [] if no matching found

    if (responseText === 'NullResponse') return []

    songs.length = 0 //clear songs array
    const songTitle = document.getElementById('songTitle').value
    const objSongs = JSON.parse(responseText).results

    for (const song of objSongs) {
        if (song.trackName.toLowerCase() == songTitle.toLowerCase())
        songs.push({
            trackId: song.trackId, title: song.trackName, collection: song.collectionName,
            artist: song.artistName, artwork: song.artworkUrl100
        })
    }

}

function buildTbl(songList, buttons) {
//to build an html string for creating a table of songs
//songList = array of song objects
//buttons = array of buttons to be added to the first column
//song object = {trackId,title,colleciton,artist,artwork}

    let str = '<table>'
    str += '<th style="width:20%;text-align:center">Action</th>'
    str += '<th style="width:20%">Title</th>'
    str += '<th>Collection</th>'
    str += '<th>Artist</th>'
    str += '<th style="width:10%">Artwork</th>'

    //create table rows
    let idx = 0
    for (let song of songList) {
        str += "<tr>"
        str += "<td style='text-align:center'>"
        for (let i = 0; i < buttons.length; i++)
            str += `<button id=${song.trackId} class='action' data-idx=${idx}>${buttons[i]}</button>`
        str += "</td>"
        str += `<td> ${song.title} </td>`
        str += `<td> ${song.collection} </td>`
        str += `<td> ${song.artist} </td>`
        str += `<td><img src=${song.artwork} alt='artwotk100'></td>`
        str += "</tr>"
        idx++
    }
    str += "</table>"

    return str
}

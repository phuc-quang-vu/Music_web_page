/*
NOTE: You need to install the npm modules by executing >npm install
before running this server
*/

const express = require('express') //express framework
const http = require('http')
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT
const LIMIT = 20

const app = express()

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get(/(^\/index.html$)|(^\/mytunes$)|(^\/mytunes.html$)/, (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/songs', (request, response) => {
  console.log(' search for ', request.query.title)
  let titleWithPlusSigns = request.query.title
  if(!titleWithPlusSigns) {
    //send json response to client
    response.json({message: 'Please enter a song title'})
    return
  }
  
  titleWithPlusSigns = titleWithPlusSigns.replace(/\s/g,'+')
  const options = {
    method: 'GET',
    hostname: 'itunes.apple.com',
    port: null,
    path: `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=${LIMIT}`,
    header: {'useQueryString': true}
  }
  //create the actual http request and set up
  //its handlers
  http.request(options, function(apiResponse) {
    let songData = ''
    apiResponse.on('data', function(chunk) {
      songData += chunk
    })
    apiResponse.on('end', function() {
      if (songData.indexOf('newNullResponse') >= 0) {
        response.send("NullResponse")
      }
      else {
        response.contentType('application/json').json(JSON.parse(songData))
      }
    })
  }).end() //important to end the request
           //to actually send the message
})

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000`)
    console.log(`http://localhost:3000/`)
    console.log(`http://localhost:3000/index.html`)
    console.log(`http://localhost:3000/mytunes`)
    console.log(`http://localhost:3000/mytunes.html`)
  }
})

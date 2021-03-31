

const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
var cors = require('cors')
// app.use(cors())

const io = require('socket.io')(server)


const PORT = process.env.PORT || 8080

app.get('/', (req,res)=>{
   res.send ('<h1>Go to either /medical or /dispatcher</h1>')
})




// for parsing incoming POST data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const STATIC_PATH = path.join('client','build')
app.use(express.static( STATIC_PATH ))





app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, './client/build/index.html'))
})



console.log ('yoyoma')
// listen for 'connection' event between browser and server >> callback fxn; pass the instance of the socket(object for each browser) 'socket' as parameter
  
io.on('connection', (socket)=>{

   console.log('user connected')

   socket.on('lol', msg=>console.log(msg))
   
   socket.on('medicPosition', data=>{
      console.log(`receiving coordinate from medicside: lng ${data.longitude}, lat ${data.latitude} at time ${data.timestamp}`)
      io.emit('receiveMedicPosition', data)
   })
   
   socket.on ('disconnect', reason => {
      console.log('user has disconnected :(')
   })


})



server.listen(PORT, () => {
   console.log (`listening on *:${PORT}`)
})
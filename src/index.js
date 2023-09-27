import express from 'express'
import { Server as webSocketServer } from 'socket.io'
import http from 'http'
import { v4 as uuid } from 'uuid'

let notes = []

const app = express()
app.use(express.static(__dirname + '/public'))

const server = http.createServer(app)
const io = new webSocketServer(server)

io.on('connection', socket => {
  console.log('Nova conexao:', socket.id)

  socket.emit('server:loadnotes', notes)

  socket.on('client:newnote', newNotes => {
    const note = { ...newNotes, id: uuid() }
    notes.push(note)
    io.emit('server:newnote', note)
  })

  socket.on('client:deletenote', noteId => {
    notes = notes.filter(notes => notes.id !== noteId)
    io.emit('server:loadnotes', notes)
  })

  socket.on('client:getnote', noteId => {
    const note = notes.find(note => note.id === noteId)
    socket.emit('server:selectednote', note)
  })

  socket.on('client:updatenote', updateNote => {
    notes = notes.map(note => {
      if (note.id === updateNote.id) {
        note.title = updateNote.title
        note.description = updateNote.description
      }

      return note
    })
    io.emit("server:loadnotes", notes)
  })
})

server.listen(3000, () => {
  console.log('Server on Port', 3000)
})

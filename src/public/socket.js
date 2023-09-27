const socket = io()

/**
 * save a new note
 * @param {string} title nate title
 * @param {description} description note description
 */


const saveNote = (title, description) => {
  socket.emit('client:newnote', {
    title,
    description
  })
}

const deleteNotes = id => {
  socket.emit('client:deletenote', id)
}

const getNote = id => {
  socket.emit('client:getnote', id)
}

const updateNote = (id, title, description) => {
  socket.emit('client:updatenote' , {
    id,
    title,
    description
  })
}

socket.on('server:newnote', appendNote)

socket.on('server:loadnotes', renderNotes)

socket.on('server:selectednote', note => {
  const title = document.querySelector('#title')
  const description = document.querySelector('#description')

  title.value = note.title
  description.value = note.description

  saveId = note.id
})

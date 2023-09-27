"use strict";

var socket = io();

/**
 * save a new note
 * @param {string} title nate title
 * @param {description} description note description
 */

var saveNote = function saveNote(title, description) {
  socket.emit('client:newnote', {
    title: title,
    description: description
  });
};
var deleteNotes = function deleteNotes(id) {
  socket.emit('client:deletenote', id);
};
var getNote = function getNote(id) {
  socket.emit('client:getnote', id);
};
var updateNote = function updateNote(id, title, description) {
  socket.emit('client:updatenote', {
    id: id,
    title: title,
    description: description
  });
};
socket.on('server:newnote', appendNote);
socket.on('server:loadnotes', renderNotes);
socket.on('server:selectednote', function (note) {
  var title = document.querySelector('#title');
  var description = document.querySelector('#description');
  title.value = note.title;
  description.value = note.description;
  saveId = note.id;
});
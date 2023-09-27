"use strict";

var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _http = _interopRequireDefault(require("http"));
var _uuid = require("uuid");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var notes = [];
var app = (0, _express["default"])();
app.use(_express["default"]["static"](__dirname + '/public'));
var server = _http["default"].createServer(app);
var io = new _socket.Server(server);
io.on('connection', function (socket) {
  console.log('Nova conexao:', socket.id);
  socket.emit('server:loadnotes', notes);
  socket.on('client:newnote', function (newNotes) {
    var note = _objectSpread(_objectSpread({}, newNotes), {}, {
      id: (0, _uuid.v4)()
    });
    notes.push(note);
    io.emit('server:newnote', note);
  });
  socket.on('client:deletenote', function (noteId) {
    notes = notes.filter(function (notes) {
      return notes.id !== noteId;
    });
    io.emit('server:loadnotes', notes);
  });
  socket.on('client:getnote', function (noteId) {
    var note = notes.find(function (note) {
      return note.id === noteId;
    });
    socket.emit('server:selectednote', note);
  });
  socket.on('client:updatenote', function (updateNote) {
    notes = notes.map(function (note) {
      if (note.id === updateNote.id) {
        note.title = updateNote.title;
        note.description = updateNote.description;
      }
      return note;
    });
    io.emit("server:loadnotes", notes);
  });
});
server.listen(3000, function () {
  console.log('Server on Port', 3000);
});
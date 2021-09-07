const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { User } = require('./backend/DataHandler');
const userHandler = new User();

app.use((req, res, next) => {
  res.cookie('handshake_adrss', req.headers['x-forwarded-for']);
  next();
});
app.get('/', (req, res) => res.sendFile(__dirname + '/frontend/chat.html'));

app.use('/static', express.static(require('path').join(__dirname, 'frontend')))
io.on('connection', (socket) => {
  socket.on('join', (data) => {
    let check = userHandler.checkBan(socket.handshake.address);
    if (!check) {
      socket.emit('message', {user: 'System', message: '<p style="color: red">You are still banned from this chat room for using slurs</p>'});
      socket.disconnect();
      return;
    }
    socket.emit('message', {user: 'System', message: `<p style="color: lime">Welcome ${data.name}</p>`});
  socket.broadcast.emit('message', {user: 'System', message: `<p style="color: lime">${data.name} Has Joined</p>`});
  socket.username = data.name;
  userHandler.addUser({username: data.name, socket});
  io.sockets.emit('usercount', userHandler.getUsernames());
  })
  socket.on('message', (data) => {
    io.sockets.emit('message', {user: data.user, message: data.message});
  });
  socket.on('slur', () => {socket.emit('message', {user: 'System', message: '<p style="color: red;">You have been banned for 10 Minutes for using slurs</p>'}); userHandler.ban(socket.handshake.address); socket.disconnect(); console.log(userHandler.bannedUsers)});
  socket.on('disconnect', () => {
    if (!socket.username) return;
    io.sockets.emit('message', {user: 'System', message: `<p style="color: red">${socket.username?socket.username:'Stranger'} Has Disconnected</p>`})
    userHandler.removeUser({username: socket.username, socket});
    io.sockets.emit('usercount', userHandler.getUsernames());
  })
});
app.use((req, res) => {res.status(404); res.redirect('/')})
server.listen(80);

//Created By ItsHisoka17
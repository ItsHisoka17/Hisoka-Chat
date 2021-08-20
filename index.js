const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { User } = require('./backend/DataHandler');
const userHandler = new User();

app.get('/', (req, res) => res.sendFile(__dirname + '/frontend/main.html'));

app.use('/static', express.static(require('path').join(__dirname, 'frontend')))
io.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.emit('message', {user: 'System', message: `Welcome ${data.name}`});
  socket.broadcast.emit('message', {user: 'System', message: `${data.name} Has Joined`});
  socket.username = data.name;
  userHandler.addUser({username: data.name, socket});
  })
  socket.on('message', (data) => {
    io.sockets.emit('message', {user: data.user, message: data.message});
  })
  socket.on('disconnect', () => {
    io.sockets.emit('message', {user: 'System', message: `${socket.username} Has Disconnected`})
    userHandler.removeUser({username: socket.username, socket});
  })
});
app.use((req, res) => {res.status(404); res.redirect('/')})
server.listen(80);

//Created By ItsHisoka17
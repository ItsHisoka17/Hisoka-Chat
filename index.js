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
app.get('/optimized_false', (req, res) => res.sendFile(__dirname + '/frontend/m.html'));

app.use('/static', express.static(require('path').join(__dirname, 'frontend')));
io.on('connection', (socket) => {
  socket.on('join', (data) => {
    let rmt_adrss = socket.request.connection.remoteAddress;
    console.log(rmt_adrss);
    let check = userHandler.checkBan(rmt_adrss);
    if (!check) {
      socket.emit('message', { user: 'System', message: '<p style="color: burlywood; font-family: Varela Round;">You are still banned from this chat room for using slurs</p>' });
      socket.disconnect();
      return;
    }
    socket.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">Welcome ${data.name}</p>` });
    socket.broadcast.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">${data.name} Has Joined</p>` });
    socket.username = data.name;
    userHandler.addUser({ username: data.name, socket });
    io.sockets.emit('usercount', userHandler.getUsernames());
    console.log(userHandler.getUsernames())
  })
  socket.on('message', (data) => {
    io.sockets.emit('message', { user: data.user, message: data.message });
  });
  socket.on('slur', () => {
    socket.emit('message', { user: 'System', message: '<p style="color: burlywood; font-family: Varela Round;">You have been banned for 10 Minutes for using slurs</p>' }); userHandler.ban(socket.handshake.address);
    socket.disconnect();
    let broadCastSM = {};
    broadCastSM["user"] = 'System';
    broadCastSM["message"] = `<p style="color: burlywood; font-family: Varela Round;">${socket.username} Has been banned for using slurs</p>`;
    socket.broadcast.emit('message', broadCastSM);
  });
  socket.on('disconnect', () => {
    if (!socket.username) return;
    userHandler.removeUser({ username: socket.username, socket });
    io.sockets.emit('usercount', userHandler.getUsernames());
    if (!userHandler.checkBan(socket.handshake.address)) return;
    io.sockets.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">${socket.username ? socket.username : 'Stranger'} Has Disconnected</p>` });
  })
});
app.use((req, res) => {
  res.status(404);
  res.send('Error: 404  |  Redirecting...<script>(function(){setTimeout(function(){window.location.replace(`https://chat.chrollo.xyz`)}, 3000)})()</script>')
});
server.listen(80);

//Created By ItsHisoka17
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
    if (data.pass && data.pass === process.env['pw']) {
      socket.admin = true;
      socket.emit('admin', true);
    } else if (data.pass && data.pass !== process.env['pw']) {
      socket.emit('admin', false);
    }
    let check = userHandler.checkBan(rmt_adrss);
    if (check && !socket.admin) {
      socket.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">You are banned from this chat room for ${check}</p>` });
      socket.disconnect();
      return;
    }
    socket.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">Welcome ${data.name}</p>` });
    socket.broadcast.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">${data.name} Has Joined</p>` });
    socket.username = data.name;
    console.log(socket.admin);
    userHandler.addUser(socket);
    io.sockets.emit('usercount', userHandler.getUsernames());
    console.log(userHandler.getUsernames())
  })
  socket.on('message', (data) => {
    io.sockets.emit('message', { user: data.user, message: data.message });
  });
  socket.on('slur', () => {
    socket.emit('message', { user: 'System', message: '<p style="color: burlywood; font-family: Varela Round;">You have been banned for 10 Minutes for using slurs</p>' }); userHandler.ban(socket.request.connection.remoteAddress, "Using Slurs");
    socket.disconnect();
    let broadCastSM = {};
    broadCastSM["user"] = 'System';
    broadCastSM["message"] = `<p style="color: burlywood; font-family: Varela Round;">${socket.username} Has been banned for using slurs</p>`;
    socket.broadcast.emit('message', broadCastSM);
  });
  socket.on('forceremove', (d) => {
    let u = userHandler.getUser(d);
    u.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">You have been disconnected by the Admin</p>` })
    u.disconnect();
    userHandler.ban(u.request.connection.remoteAddress, "[Reason not found: Banned by Admin]");
  })
  socket.on('disconnect', () => {
    if (!socket.username) return;
    userHandler.removeUser(socket);
    io.sockets.emit('usercount', userHandler.getUsernames());
    if (!userHandler.checkBan(socket.handshake.address)) return;
    io.sockets.emit('message', { user: 'System', message: `<p style="color: burlywood; font-family: Varela Round;">${socket.username ? socket.username : 'Stranger'} Has Disconnected</p>` });
  })
});
app.use((req, res) => {
  res.status(404);
  res.send('Error: 404  |  Redirecting...<script>(function(){setTimeout(function(){window.location.replace(`https://Hisoka-Chat.hisoka17.repl.co`)}, 3000)})()</script>')
});
server.listen(80);

//Created By ItsHisoka17
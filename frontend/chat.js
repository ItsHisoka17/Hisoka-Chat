let socket = io();


function handleUserName(){
let name;
let pName = prompt('Hey There! What would you like your username to be?');
name = (pName!==null&&pName.length>0)?pName:'Stranger';

socket.username = name;
document.write(`<title>${name}</title>`)
socket.emit('join', {name})
};

function onMessage(){
  function selfMessage(){
  let form = document.getElementById('box');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let { value } = document.getElementById('message');
    socket.emit('message', {user: socket.username, message: value});
    document.getElementById('message').value = '';
  })
  }
  function mainMessage(){
    socket.on('message', data => {
      let { user, message } = data;
      let div = document.createElement('div');
      div.innerHTML = `<br></br><p style="size: 9px;color: grey;">${user} - ${new Date().toTimeString().split(' ')[0].replace(/00/, '12').slice(0, 5)}</p>\n<p>${message}</p>`;
      let li = document.createElement('li');
      li.appendChild(div);
      let chat = document.getElementById('chat');
      chat.appendChild(li);
    })
  }
  selfMessage();
  mainMessage();
}

function init(){
  handleUserName();
  onMessage();
};

init();
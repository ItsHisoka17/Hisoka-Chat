let socket = io();
let users = [];

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
    let regex = /^.*(n(\s{1,2}|.{1,2})?(\s{1,2}|.{1,2})?i(\s{1,2}|.{1,2})?g(\s{1,2}|.{1,2})?g(\s{1,2}|.{1,2})?e(\s{1,2}|.{1,2})?r(\s{1,2}|.{1,2})?).*$/ig;
    if (regex.exec(value)){
      alert('Slurs are banned in this chat room');
      document.getElementById('message').value = '';
      return;
    };
    socket.emit('message', {user: socket.username, message: value});
    document.getElementById('message').value = '';
  })
  }
  function mainMessage(){
    socket.on('message', data => {
      let { user, message } = data;
      let div = document.createElement('div');
      let image_regex = /^.*(https?:\/\/.*\.(png|webp|gif|jpg|jpeg)(\?.+)?)$/gm;
      let test = image_regex.exec(message);
      if (test){
        div.innerHTML = `<br></br><p style="size: 9px;color: grey;">${user} - ${new Date().toTimeString().split(' ')[0].replace(/00/, '12').slice(0, 5)}</p><img src="${message}" style="width: 25%; height: 20%; border-radius: 5%;"></img>`;
        let li = document.createElement('li');
        li.appendChild(div);
        let chat = document.getElementById('chat');
        chat.appendChild(li);
        return false;
      }
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
  setTimeout(() => console.log(users), 10000)
  handleUserName();
  onMessage();
};

init();

//Created by ItsHisoka17
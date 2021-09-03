let socket = io();

function handleUserName(){
let params = new URLSearchParams(window.location.search);
let name;
if (params.get('u')){
  name = params.get('u');
  socket.username = name;
  document.title = `Hisoka Chat - ${name}`
  socket.emit('join', {name})
} else {
  for (let input of ['message', 'button']){
    $(`#${input}`).prop('disabled', true);
  }
  /*
let pName = prompt('Hey There! What would you like your username to be?');
*/
$('#username').fadeIn(1000);
$('#username').submit(function(e){
  e.preventDefault();
  let pName = $('#u').val();
  name = (pName!==null&&pName.length>0)?pName:'Stranger';
  window.location.replace(`https://chat.chrollo.xyz?u=${name}`);
})
}
};

function onMessage(){
  function selfMessage(){
  let form = document.getElementById('box');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let { value } = document.getElementById('message');
    let regex = /^.*(n(\s{1,2}|.{1,2})?(\s{1,2}|.{1,2})?i(\s{1,2}|.{1,2})?g(\s{1,2}|.{1,2})?g(\s{1,2}|.{1,2})?((e(\s{1,2}|.{1,2})?r(\s{1,2}|.{1,2})?)|a)).*$/ig;
    if (regex.exec(value)){
      socket.emit('slur');
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
        div.innerHTML = `<p style="size: 9px;color: grey;">${user} - ${moment().format('hh:mm A')}</p><img src="${message}" style="width: 25%; height: 20%; border-radius: 5%;"></img><br></br>`;
        let li = document.createElement('li');
        li.appendChild(div);
        let chat = document.getElementById('chat');
        chat.appendChild(li);
        return false;
      }
      div.innerHTML = `<p style="size: 9px;color: grey;">${user} - ${moment().format('hh:mm A')}</p>\n<p>${message}</p><br></br>`;
      let li = document.createElement('li');
      li.appendChild(div);
      let chat = document.getElementById('chat');
      chat.appendChild(li);
      window.scrollTo(0, document.body.scrollHeight);
    })
  }
  selfMessage();
  mainMessage();
}

function userCount(){
  socket.on('usercount', (data) => $('.users').html(`${data} User${data>1?'s':''} Online`))
}

function init(){
  handleUserName();
  onMessage();
  userCount();
};

init();

//Created by ItsHisoka17
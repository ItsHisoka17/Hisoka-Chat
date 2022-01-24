let socket = io();

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function handleDeviceCSS(){
  let p = document.createElement('p');
  p.innerHTML = '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  p.style["fontSize"] = "50px";
  p.style["fontFamily"] = "Varela Round";
  p.style["position"] = "absolute";
  p.style["top"] = "27%";
  p.style["right"] = "47%";
  p.id = "_loading";
  document.body["appendChild"](p);
  setTimeout(() => {
  let device = window.mobileCheck() ? "mob" : "oth";
  if (device === "mob"){
    window.location.replace('/optimized_false');
  }
  $("#_loading").hide();
  handleUserName();
  }, 2500)
}

function handleUserName(){
let params = new URLSearchParams(window.location.search);
let name;
if (params.get('u')){
  let pass;
  if (params.get('pw')){
    pass = params.get('pw');
  };
  name = params.get('u');
  socket.username = name;
  document.title = `${name} - Flemo Chat`
  socket.emit('join', {name, pass})
} else {
  for (let input of ['message', 'button', 'img']){
    $(`#${input}`).prop('disabled', true);
  }
  /*
let pName = prompt('Hey There! What would you like your username to be?');
*/
$('#username').fadeIn(1000);
$('#admin_login').click(()=>$('#pw').fadeIn(500));
$('#username').submit(function(e){
  e.preventDefault();
  let pName = $('#u').val();
  let pw = $('#pw').val();
  if (pName.length>11) {
    alert("Username cannot be longer than 11 characters");
    return handleUserName();
  }
  name = (pName!==null&&pName.length>0)?pName:'Stranger';
  window.location.replace(`https://chat.chrollo.xyz?u=${name}&pw=${pw}`);
})
}
};

function onMessage(){
  socket.on('admin', () => {socket.admin = true});
  function selfMessage(){
  let form = document.getElementById('box');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let { value } = document.getElementById('message');
    let regex = /^.*(n(\s{1,2}|.{1,2})?(\s{1,2}|.{1,2})?i(\s{1,2}|.{1,2})?g(\s{1,2}|.{1,2})?g(\s{1,2}|.{1,2})?((e(\s{1,2}|.{1,2})?r(\s{1,2}|.{1,2})?)|a)).*$/ig;
    if (regex.exec(value)){
      $('#t_m_c_content').html('Your ban will expire in 10 minutes');
      $('#t_m_c_type').html('&#9888; You have been banned for using slurs');
      $('.t_m_c').fadeIn(1000);
      socket.emit('slur');
      document.getElementById('message').value = '';
      return;
    };
    if (value.length>600){
      $('#t_m_c_content').html('Message must be under 600 characters');
      $('#t_m_c_type').html('&#9888; Too many chararacters');
      $('.t_m_c').fadeIn(1000);
      document.getElementById('message').value = '';
      return;
    }
    console.log(socket.admin);
    if (socket.admin){
      if (value.startsWith('_remove')){
        let removedUser = value.split(' ').filter((a)=>a!=='_remove').join('');
        console.log(removedUser);
        socket.emit('forceremove', removedUser);
        document.getElementById('message').value = '';
        return;
      }
    }
    socket.emit('message', {user: socket.username, message: value});
    document.getElementById('message').value = '';
  })
  }

  function image(){
    document.getElementById('img').addEventListener('change', (e) => {
      if (e.target.files[0].size>700000){
        $("#t_m_c_content").html('File cannot be larger than 700kb');
        $('#t_m_c_type').html('File too large');
        $('.t_m_c').fadeIn(1000);
        return;
      }
      let div = document.createElement('div');
      div.innerHTML = `<p style="size: 9px;color: grey; "> ${socket.username} - ${moment().format('hh:mm A')}</p>\n<p style="color: burlywood; font-family: Varela Round;">Sending...</p><br></br><br></br>`;
      let li = document.createElement('li');
      li.appendChild(div); 
      let id = "";
      for (let i = 0; i<25; i++){
        id += "abcdefghijklmnopqrstuvwxyz123457890!@#%^&*()_+".charAt(Math.floor(Math.random() * "abcdefghijklmnopqrstuvwxyz123457890!@#%^&*()_+".length))
      }
      li.id = id;
      let chat = document.getElementById('chat');
      chat.appendChild(li);
      setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
      let data = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(r) {
        document.getElementById(id).style.display = "none";
        socket.emit('message', {user: socket.username, message: `<img src="${r.target.result}" onclick="window.open(${r.target.result})" style="width: 25%; height: 20%; border-radius: 5%;">`
    })
  };
    reader.readAsDataURL(data);
      }, 1500)
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
      div.innerHTML = `<p style="size: 9px;color: grey;">${user} - ${moment().format('hh:mm A')}</p>\n<p style="color: burlywood; font-family: Varela Round;">${message}</p><br></br><br></br>`;
      let li = document.createElement('li');
      li.appendChild(div);
      let chat = document.getElementById('chat');
      chat.appendChild(li);
      window.scrollTo(0, document.body.scrollHeight);
    })
  }
  selfMessage();
  mainMessage();
  image();
}



function userCount(){
  $("#user_btn").click(function(){
    if (document.getElementsByClassName('users')[0].style.display==="none"){
      $(".users").css('display', 'block');
      $("#user_btn").html("Hide Users");
    } else {
      $(".users").css('display', 'none');
      $("#user_btn").html("View Users");
    }
  });
  socket.on('usercount', (data) => {$('.users').html(`Online User${data.length>1?'s':''}: ${data.length}<br></br>${data.join('<br></br>')}`)
  })
}

function init(){
  handleDeviceCSS();
  onMessage();
  userCount();
};

init();

//Created by ItsHisoka17
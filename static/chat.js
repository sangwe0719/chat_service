let socket = io.connect();

let myNick;

console.log(moment(new Date()).format("h:mm A"));

socket.on('connect', () => {
    console.log('⭕️ Client Socket Connected >> ', socket.id);
  });

socket.on('notice', (msg) => {
    document
      .querySelector('#chat-list')
      .insertAdjacentHTML('beforeend', `<div class="notice">${msg}</div>`);
  });

  function entry() {
    console.log(document.querySelector('#nickname').value);

    if (document.querySelector('#nickname').value== "") {
      alert("닉네임을 입력하세요.")
    } else{
      socket.emit('setNick', document.querySelector('#nickname').value);
    }
  }
  
    socket.on('entrySuccess', (nick) => {
    myNick = nick;

    document.querySelector('#nickname').disabled = true; 
    document.querySelector('.entry-box > button').disabled = true; 
  
    document.querySelector('.chat-box').classList.remove('d-none');
    document.querySelector('.entry-box').setAttribute('style','display: none');

  });
  
  socket.on('error', (msg) => {
    alert(msg);
  });
  
  socket.on('updateNicks', (obj) => {
    let options = `<option value="all">전체</option>`;
  
    for (let key in obj) {

      options += `<option value="${key}">${obj[key]}</option>`;
    }
    console.log(options);
  
    document.querySelector('#nick-list').innerHTML = options;

    //let entry_number = document.querySelector(".entry_number");
    //entry_number.innerText = parseInt(entry_number.innerText)+1;

    const nickList = document.querySelector('#nick-list');
    console.log('>>', nickList.children.length);
    let entry_number = document.querySelector(".entry_number")
    entry_number.innerText = nickList.children.length - 1;
  });
  
  function send(event) {

    const data = {
      myNick: myNick,
      dm: document.querySelector('#nick-list').value,
      msg: document.querySelector('#message').value,
    };
    console.log(data);
    if (data.msg == "") {
      alert("메세지를 입력하세요.")
    } else{
      socket.emit('send', data);
      document.querySelector('#message').value = ''; 
    }

    document.querySelector('#message').value = ''; 
  }

  const nickname = document.getElementById('nickname');
  nickname.addEventListener('keyup', function(event) {
    const data = {
      myNick: myNick,
    };

    if(event.keyCode === 13) {
      event.preventDefault();
      socket.emit('send',data);
    }
  })
  
  const message = document.getElementById('message');

  message.addEventListener('keyup',function(event) {
    const data = {
      myNick: myNick,
      dm: document.querySelector('#nick-list').value,
      msg: document.querySelector('#message').value,
      time: moment(new Date()).format("h:mm A")
    };

    if(event.keyCode === 13) {
      event.preventDefault();
      socket.emit('send',data);
      document.querySelector('#message').value = ''; 
    }
  })

  

  socket.on('newMessage', (data) => {
    console.log('socket on newMessage >> ', data);

    let time = moment(new Date()).format("h:mm A");

    let chatList = document.querySelector('#chat-list');
  
    let div = document.createElement('div');

    let date = document.createElement('span');
  
    let divChat = document.createElement('div');

    let mychat = document.querySelector('.my-chat');

    const nickname = data.nick;

    time.className = 'font-style';
  
    if (myNick === data.nick) {
      div.classList.add('my-chat');
    } else {
      div.classList.add('other-chat');
    }
  
    if (data.dm) {
      div.classList.add('secret-chat');
      divChat.textContent = data.dm;
    }
  
    divChat.textContent = divChat.textContent + `${data.nick} : ${data.msg}`; 
    if (myNick === data.nick) {
      nickname.classList= "nickname";
      div.append(time);
      div.append(divChat);
      chatList.append(div);
    } else {
      div.append(divChat);
      chatList.append(div);
      div.append(time);
    }
  
    chatList.scrollTop = chatList.scrollHeight;
  });
  
  socket.on("chatting",(data) => {
    const datas = {nick, msg, time};
    console.log(datas);
  })

  function restart () {
    window.location.href="/"
  }
  
  
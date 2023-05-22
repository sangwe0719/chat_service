const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 8000;
const moment = require('moment');

app.set('view engine', 'ejs');
app.use('/views', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/static'));
app.use(express.json());

app.get('/', function (req, res) {
  console.log('client connected');
  res.render('chat');
});


const nickObj = {};

function updateNickList() {
  io.emit('updateNicks', nickObj);
}

io.on('connection', (socket) => {
 
  console.log('⭕ Server Socket Connected >> ', socket.id);

  socket.on('setNick', (nick) => {
    console.log('socket on setNick >> ', nick); 

    if (Object.values(nickObj).indexOf(nick) > -1) {
    
      socket.emit('error', '이미 존재하는 닉네임입니다. 다시 입력해주세요!!');
    } else {
    
      nickObj[socket.id] = nick; 
      io.emit('notice', `${nick}님이 입장하셨습니다.`); 
      socket.emit('entrySuccess', nick); 
      updateNickList();
    }
  });

  socket.on('disconnect', () => {
    console.log('**** ❌ Server Socket Disonnected >> ', socket.id);

    io.emit('notice', `${nickObj[socket.id]}님이 퇴장하셨습니다.`); 
    delete nickObj[socket.id];
    updateNickList();
  });

  socket.on('send', (obj) => {
    console.log('socket on send >> ', obj);

    if (obj.dm !== 'all') {
      let dmSocketId = obj.dm;
      const time = moment(new Date()).format("h:mm A")

      const sendData = { nick: obj.myNick, dm: '(속닥속닥)', msg: obj.msg, time: obj.time};
      io.to(dmSocketId).emit('newMessage', sendData);
      socket.emit('newMessage', sendData);
    } else {
      const sendData = { nick: obj.myNick, msg: obj.msg, time: obj.time};
      io.emit('newMessage', sendData);
    }
  });
});


http.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});


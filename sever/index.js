//創建一個伺服器
const app = require('express')();
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    }
});

//socket連接
io.on('connection', (socket) => {
    //連上message(單純名稱) 會有name跟message
    socket.on('message', ({ name, message }) => {
        //發出消息時
        io.emit('message', { name, message });
    });
});

//連線
server.listen(4000, function () {
    console.log('listening on port 4000');
});

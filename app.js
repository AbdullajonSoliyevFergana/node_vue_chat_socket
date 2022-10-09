const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
const env = require('dotenv');


// Initial config
env.config();

// Default data
let messages = [];
let USERS = {};

// Lister server
server.listen(process.env.SOCKET_PORT, () => {
    console.log(`Server was working on port ${process.env.SOCKET_PORT}`);
});
// Sockent events
io.sockets.on('connection', (socket) => {
    // Connect
    console.log(`${socket.id} was connected`);
    USERS[socket.id] = socket;

    // Send message
    socket.on('send', (data) => {
        // console.log(data);
        messages.push(data);
    })

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.id} was disconnected`);
    });

});

// Live update package
setInterval(() => {
    // TODO: send packages
    for(let i in USERS){
        USERS[i].emit('update', messages);
    }
}, 1000 / 25);
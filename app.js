const app = require('express')();
const axios = require('axios').default;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});
const env = require('dotenv');
const url = 'http://teacher.devapp.uz/';
// const url = 'http://127.0.0.1:8000/';


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

    //       
    socket.on('authorization', (authData) => {
        // console.log(authData);

        let userToken = authData.user_token;
        let socket_id = socket.id;
        let user_type = authData.user_type;
        axios.get(`${url}api/socket_id/${userToken}/${socket_id}/${user_type}`)
            .then(function (response) {
                // console.log(response);
                // console.log('update id');
            })
            .catch(function (error) {
                // console.log(error);
            });
    });

    // Send message
    socket.on('send', (data) => {
        axios.post(`${url}api/send/message`, data)
            .then(function (response) {
                // console.log(response);
                // console.log('send');
            })
            .catch(function (error) {
                console.log(error);
            });
        // console.log(data);
        messages.push(data);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.id} was disconnected`);
    });

});

// Live update package
setInterval(() => {
    // TODO: send packages
    for (let i in USERS) {
        USERS[i].emit('update', messages);
    }
}, 1000 / 25);
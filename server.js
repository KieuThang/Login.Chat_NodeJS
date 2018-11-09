var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;
var path = require('path')
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, '/public/')));
var Users = require('./Routes/Users');
app.use('/users', Users);

var Rooms = require('./Routes/Rooms')
app.use('/rooms', Rooms)

var Chats = require('./Routes/Chats')
app.use('/chats', Chats)

app.get('/', function (req, res) {
    var appData = {};
    appData.data = "Hello!";
    res.status(200).json(appData);
})

var usernames = {};
var numOfUsers = {};
var numUserJoined = 0;

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/public/login/" + "login.html");
});

io.on('connection', function (socket) {
    console.log('a user connected :' + socket.id);
    socket.broadcast.emit('hi');

    socket.on('disconnect', function () {
        console.log('user disconnected:' + socket.id);

        numUserJoined -= 1;
        var data = { numUsers: numUserJoined, username: "" + socket.username };
        socket.broadcast.to(socket.room).emit("server__user_left", data);
    });

    socket.on('client__sent_message', function (msg) {
        console.log('client__sent_message:' + msg);
        var obj = JSON.parse(msg);
        var data = { username: "" + obj.username, message: "" + obj.message };
        socket.broadcast.to(socket.room).emit('server__sent_message', data);

        var chats = require('./Routes/Chats')
        chats.sendMessage(data)
    });

    socket.on('client__login', function (username, room) {
        console.log('user request login:' + username + ", num:" + numUserJoined + ",room:" + room);
        numUserJoined += 1;
        // store the username in the socket session for this client
        socket.username = username;

        // store the room name in the socket session for this client
        socket.room = room;
        // add the client's username to the global list
        usernames[username] = username;
        // send client to room 1
        socket.join(room);

        var data = { numUsers: numUserJoined, username: "" + username, room: room };
        // echo to client they've connected
        socket.emit('server__join_room_welcome', data);
        // echo to room 1 that a person has connected to their room
        var data = { numUsers: numUserJoined, username: "" + username };
        socket.broadcast.to(room).emit('server__update_room', data);
    });

    socket.on('client__typing', function (msg) {
        console.log('server__user_typing:' + msg);
        var data = { username: "" + msg };
        socket.broadcast.to(socket.room).emit('server__user_typing', data);
    });

    socket.on('client__stop_typing', function (msg) {
        console.log('client__stop_typing :' + msg);
        var data = { username: "" + msg };
        socket.broadcast.to(socket.room).emit('server__user_stop_typing', data);
    });

    socket.on('client__add_user', function (msg) {
        console.log('client__add_user: ' + msg);
        var data = { numUsers: numUserJoined, username: "" + msg };
        socket.broadcast.to(socket.room).emit('server__new_user_joined', data);
    });
});

http.listen(port, function () {
    console.log("Server is running on port: " + port);
});
var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;
var path = require('path')

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

app.get('/', function (req, res) {
    var appData = {};
    appData.data = "Hello!";
    res.status(200).json(appData);
})

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/public/login/" + "login.html");
});


app.listen(port, function () {
    console.log("Server is running on port: " + port);
});
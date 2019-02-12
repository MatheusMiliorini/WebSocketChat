var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});
app.get('/chat', function (req, res) {
    res.sendFile(__dirname + "/chat.html");
});

io.on('connection', function (socket) {
    var nomeUsuario;

    socket.on('login', function (nome) {
        console.log(`O usuário ${nome} acabou de entrar no chat`);
        nomeUsuario = nome; //Armazena o nome do usuário para usar mais tarde
    });
    socket.on('mensagem', function (msg) {
        console.log(`${nomeUsuario}: ${msg}`);
        io.emit('mensagem', {
            nomeUsuario: nomeUsuario,
            mensagem: msg
        });
    });
    socket.on('disconnect', function () {
        console.log(`O usuário ${nomeUsuario} saiu do chat`);
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});
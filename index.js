var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

var views = __dirname + "/views/";

// Roteamento
app.get('/', function (req, res) {
    res.sendFile(views + "login.html");
});
app.get('/chatList', function (req, res) {
    res.sendFile(views + "chatList.html");
});
app.get('/chat/:codigo/:destino/:conversaAbertaPorTerceiro', function (req, res) {
    res.sendFile(views + "chat.html");
});

// Fim do roteamento

var usuariosLogados = [];

io.on('connection', function (socket) {
    var nomeUsuario;

    socket.on('login', function (nome) {
        console.log(`Usuario ${nome} conectado`);
        nomeUsuario = nome; //Armazena o nome do usuário para usar mais tarde
        usuariosLogados.push(nome);
        io.emit('preencher lista', usuariosLogados.sort());
    });

    socket.on('disconnect', function () {
        //busca o usuário na array e remove
        for (i = 0; i < usuariosLogados.length; i++) {
            if (usuariosLogados[i] == nomeUsuario) {
                usuariosLogados.splice(i, 1);
                break;
            }
        }
        io.emit('preencher lista', usuariosLogados.sort());
    });

    socket.on('abertura chat', function (data) {
        console.log(`Usuario ${data.origemConversa} abriu chat com ${data.destinoConversa}`);

        //Faz o DESTINO abrir a conversa também
        io.emit('abrir conversa', {
            'destinoConversa': data.destinoConversa,
            'idConversa': data.idConversa
        });

        nomeUsuario = `${data.destinoConversa}:`; //Dois pontos atrás pra que quando feche essa tela, não remover da lista de usuários ativos
    });

    socket.on('mensagem', function (data) {
        console.log(`${nomeUsuario} ${data.msg}`);
        io.emit('mensagem', {
            'nomeUsuario': nomeUsuario,
            'mensagem': data.msg,
            'idConversa': data.idConversa,
            'origem': data.origem
        });
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
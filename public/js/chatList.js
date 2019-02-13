var classes = ["messageBox1", "messageBox2"];
var classeAtual = 0;

$(document).ready(function () {

    //Lê o cookie com o nome do usuário
    var nome = document.cookie.split('=')[1];

    //Se não houver nome, joga para a página de login
    if (nome == null) {
        window.location = "/";
    } else {
        //Somente inicia o Socket caso o usuário tenha dado um nome a si mesmo
        var socket = io();
    }

    socket.emit('login', nome);

    socket.on('preencher lista', function (usuariosLogados) {
        console.log(usuariosLogados);
        $("#listaUsuarios").empty().append(`<li class="list-group-item active">Usuários logados</li>`);
        usuariosLogados.forEach(usuario => {
            $("#listaUsuarios").append(`
                <li class="list-group-item">${usuario}</li>
            `);
        });
    });

    $("ul").on('click', 'li', function () {
        var _nome = $(this).text();
        if (_nome != "Usuários logados" && _nome != nome) {
            //Abre uma nova tela de conversa (iniciando). Só pode abrir uma conversa por destino.
            window.open(`/chat/${Math.floor((Math.random() * 100000) + 1 )}/${_nome}/false`, _nome, 'height=300px,width=700px;');
        }

    });

    socket.on('abrir conversa', function (data) {
        if (data.destinoConversa == nome) {
            window.open(`/chat/${data.idConversa}/${data.destinoConversa}/true`, data.origemConversa, 'height=300px,width=700px;');
        }
    });
});
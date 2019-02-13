$(document).ready(function () {
    //Lê o cookie com o nome do usuário
    var nome = document.cookie.split('=')[1];
    var idConversa = window.location.href.split('/')[4];
    var destinoConversa = window.location.href.split('/')[5];
    var conversaAbertaPorTerceiro = window.location.href.split('/')[6];

    //Se não houver nome, joga para a página de login
    if (nome == null) {
        window.location = "/";
    } else {
        //Somente inicia o Socket caso o usuário tenha dado um nome a si mesmo
        var socket = io();

        if (conversaAbertaPorTerceiro == "false") //Quem abriu a conversa foi VOCÊ!
            socket.emit('abertura chat', {
                'origemConversa': nome,
                'idConversa': idConversa,
                'destinoConversa': destinoConversa
            });
    }

    socket.on('mensagem', function (data) {
        console.log(data.mensagem);
        if (data.idConversa == idConversa) {
            $("#mensagens").append(`
            <div class="mensagem">
                <span class="nome">${data.origem}</span>
                <span class="texto">${data.mensagem}</span>
            </div>
        `);
        }

    });

    $('form').submit(function (e) {
        e.preventDefault();
        var msg = $("#campoMensagem").val();
        $("#campoMensagem").val('');
        socket.emit('mensagem', {
            'msg': msg,
            'idConversa': idConversa,
            'origem': nome
        });
    });
});
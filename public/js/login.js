$(document).ready(function () {
    $('form').submit(function (e) {
        e.preventDefault();
        document.cookie = `nome=${$('#nome').val()}`;
        $("#nome").val('');
        window.open('/chatList',"Lista de usuários","height=500px,width=300px");
    })
});
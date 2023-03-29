var socket = io("ws://localhost:3000", { transports : ['websocket'] });

const room_url = "localhost:5000/room/";

socket.on('connect', function() {
    console.log("connected");
    url_last = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    if(url_last != "") {
        vue_app.room_id = url_last;
        join_to_room(url_last);
        vue_app.page_id = 2;
    }
});

socket.on('get_message', function(sender_id, message) {
    var number = vue_app.messages_list.length;
    vue_app.messages_list.push({sender: sender_id, text: message, id:number});
});

socket.on('kick_event', function(reason) {
    console.log(reason)
    vue_app.page_id = 0;
});

socket.on('update_players_list', function(players) {
    console.log(players);
    vue_app.players_list = players;
});

socket.on('start_room', function() {
    vue_app.messages = [];
    vue_app.page_id = 3;
});

socket.on('get_room_id', function(id) {
    vue_app.room_id = id;
    vue_app.page_id = 2;
    random_name();
    console.log('join_to_room', id, vue_app.player_name, "");
    socket.emit('join_to_room', id, vue_app.player_name, "");
});

socket.on('set_king', function(status) {
    vue_app.is_main = status
});

function copy_to_clipboard() {
    var inputc = document.body.appendChild(document.createElement("input"));
    inputc.value =  room_url + vue_app.room_id;
    inputc.focus();
    inputc.select();
    document.execCommand('copy');
    inputc.parentNode.removeChild(inputc);
    alert("Ссылка скопирована в буфер обмена")
}

function create_room() {
    genre = vue_app.genre
    intro = vue_app.intro
    if(genre && intro) {
        console.log('create_room', genre, intro)
        socket.emit('create_room', genre, intro);
    }
}

function get_random_int(max) {
    return Math.floor(Math.random() * max);
}

function random_name() {
    vue_app.player_name = "Зверский рыцарь #" + get_random_int(1000);
}

function start_room() {
    console.log('start_room');
    socket.emit('start_room')
}

function join_to_room(room_id) {
    random_name();
    console.log('join_to_room', room_id, vue_app.player_name, "");
    socket.emit('join_to_room', room_id, vue_app.player_name, "");
}

function change_state() {
    vue_app.ready = !vue_app.ready;
    update_player_info();
}

function update_player_info() {
    var player_name = vue_app.player_name;
    var bio = vue_app.bio;
    var state = vue_app.ready;
    console.log('update_player_info', player_name, bio, state);
    socket.emit('update_player_info', player_name, bio, state);
}

function leave_room() {
    console.log('leave_room');
    socket.emit('leave_room');
    vue_app.page_id = 0;
}

function send_message() {
    text = vue_app.cur_message;
    vue_app.cur_message = "";
    console.log('get_message', text);
    socket.emit('get_message', text);
}

function kick_player(id) {
    console.log('kick_player', id);
    socket.emit('kick_player', id);
}
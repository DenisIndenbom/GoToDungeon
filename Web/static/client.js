var socket = io();

socket.on('connect', function() {
    console.log("connected");
});

socket.on('get_message', function(sender_id, message) {
    vue_app.messages.push({"sender": sender_id, "msg": message});
});

socket.on('update_players_list', function(players, is_king) {
    vue_app.players = players;
    vue_app.is_main = is_king;
});

socket.on('start_game', function(args) {
    vue_app.messages = [];
    vue_app.page_id = 3;
});

socket.on('get_room', function(id) {
    vue_app.room_id = id
});


function create_room() {
    genre = vue_app.genre
    intro = vue_app.intro
    if(genre && intro) {
        console.log(genre);
        console.log(intro);
        socket.emit('create_room', {genre: genre, intro: intro});
    }
}

function random_name() {
    vau_app.name = "Зверский рыцарь"
}

function start_room() {
    socket.emit('start_room')
}

function join_to_room(room_id) {
    socket.emit
}

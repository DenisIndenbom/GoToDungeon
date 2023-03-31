Vue.component('vue-wait-player', {
    props: ['player', 'is_main', 'kick'],
    template: `
    <div class = "box" style="width: 100%">
        <div class="columns is-vcentered" style="height: 15%">
            <div class="column">
                <label class="label">{{ player.name }}</label>
            </div>
            <div class="column">
                <a class="button is-danger" v-if="!player.ready_state">Не готов</a>
                <a class="button is-success" v-else>Готов</a>
                <a class="button is-warning" v-if="is_main" @click="kick(player.id)">Выгнать</a>
            </div>
        </div>
    </div>
    `
})

Vue.component('vue-message', {
    props: ['message'],
    template: `
    <div class="box" style="width: 90%; margin:auto, margin-bottom: 20px">
        <div class="content">
            <h4>{{ message.sender }}</h4>
            <p>{{ message.text }}</p>
        </div>
    </div>
    `
})


var vue_app = new Vue({
  el: '#app',
  data: {
    page_id: 0,
    players_list:[{name:"Петя Иванов", id:"234567890", ready_state:false}],
    messages_list: [],
    genre: "",
    intro: "",
    ready: false,
    is_main: false,
    room_id: "",
    player_name: "",
    bio: "",
    cur_message: ""
  },
  methods: {
    kick(id) {
        kick_player(id);
    }
  },
  updated() {
  this.$nextTick(function () {
    var block = document.getElementById("msg_block");
    if(block)
        block.scrollTop = block.scrollHeight;
  })
}
})

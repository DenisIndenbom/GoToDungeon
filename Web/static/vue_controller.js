Vue.component('vue-wait-player', {
    props: ['player', 'is_main'],
    template: `
    <div class = "box" style="width: 100%">
        <div class="columns is-vcentered" style="height: 15%">
            <div class="column">
                <label class="label">{{ player.name }}</label>
            </div>
            <div class="column">
                <a class="button is-danger" v-if="!player.ready">Не готов</a>
                <a class="button is-success" v-else>Готов</a>
                <a class="button is-warning" v-if="is_main">Выгнать</a>
            </div>
        </div>
    </div>
    `
})


var vue_app = new Vue({
  el: '#app',
  data: {
    page_id: 2,
    players_list:[],
    messages: [],
    genre: "",
    intro: "",
    is_main: false,
    room_id: ""
  }
})

url_last = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
if(url_last != "") {
    vue_app.room_id = url_last;
}
console.log(vue_app.room_id);

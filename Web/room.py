from player import Player
from message import Message


class Room:
    players = {}
    state = "wait"
    message_history = []

    genre = ""
    intro = ""

    def check_player_exist(self, player_id):
        return player_id in self.players

    def join(self, player_id):
        if player_id in self.players:
            return 0
        self.players[player_id] = Player()
        return 1

    def leave(self, player_id):
        if player_id not in self.players:
            return 0
        self.players.pop(player_id)
        if self.is_empty():
            return 2
        if player_id == self.main_player:
            self.main_player = str(next(iter(self.players)))
        return 1

    def update(self, player_id, name, disc):
        if player_id not in self.players:
            return 0
        self.players[player_id].update(name, disc)
        return 1

    def update_state(self, player_id, state):
        if player_id not in self.players:
            return 0
        self.players[player_id].ready(state)

    def is_empty(self):
        return len(self.players) == 0

    def new_message(self, player_id, text):
        if player_id not in self.players:
            return 0
        self.message_history.append(Message(self.players[player_id].name, text))
        return 1

    def __init__(self, main_player_id, genre, intro):
        self.main_player = main_player_id
        self.genre = genre
        self.intro = intro
        self.join(main_player_id)

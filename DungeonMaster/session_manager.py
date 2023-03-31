from session import Session
from input_templates import *

import os

os.environ["OPENAI_API_KEY"] = "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"


class SessionManager:
    sessions_list = {}

    def __init__(self):
        pass

    def new_session(self, s_id, intro, genre, players):
        self.sessions_list[s_id] = Session()
        return self.sessions_list[s_id].get_using_GPT(start_template(intro, genre, players))

    def del_session(self, s_id):
        self.sessions_list.pop(s_id, None)

    def message(self, s_id, sender_name, text):
        return self.sessions_list[s_id].get_using_GPT(message_template(sender_name, text))

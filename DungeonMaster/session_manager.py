from session import Session
from input_templates import *

class SessionManager:
    def __init__(self):
        self.sessions: dict = {}
        
    def __session_exists(self, s_id: str) -> bool:
        return s_id in self.sessions
    
    def new_session(self, s_id, intro, genre, players):
        self.sessions[s_id] = Session()

        return self.sessions[s_id].get_using_GPT(start_template(intro, genre, players))

    def del_session(self, s_id: str) -> None:
        if not self.__session_exists: return None

        self.sessions.pop(s_id, None)

    def message(self, s_id: str, sender_name: str, text: str) -> dict | None:
        if not self.__session_exists: return None

        return self.sessions[s_id].get_using_GPT(message_template(sender_name, text))

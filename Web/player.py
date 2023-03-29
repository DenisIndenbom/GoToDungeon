class Player:
    name = ""
    description = ""
    state = "wait"

    def __init__(self, name="", desc="", st="wait"):
        self.name = name
        self.description = desc
        self.state = st

    def update(self, name, desc):
        self.name = name
        self.description = desc

    def ready(self, state):
        if state:
            self.state = "ready"
        else:
            self.state = "wait"

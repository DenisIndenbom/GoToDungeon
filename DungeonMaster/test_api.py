from session_manager import SessionManager

manager = SessionManager()

print(manager.new_session("id", "Обычный мир Фэнтези", "Фэнтези", [
    {"name": "Миха", "bio": "Гном, который внезапно решил пойти в поход."},
    {"name": "Лупа", "bio": "эльф, который научился отлично стрелять из лука."},
    {"name": "Пупа", "bio": "очень сильный орк."}
]))

while True:
    name = input()
    text = input()
    print(manager.message("id", name, text))


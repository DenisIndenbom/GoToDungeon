def start_template(intro, genre, players):
    """Жанр игры: Фэнтези. Описание мира: обычный мир Фэнтези.
            В игре будет 3 игрока.
            Первый игрок. Имя: Миха. Биография: Гном, который внезапно решил пойти в поход.
            Второй игрок. Имя: Лупа. Биография: эльф, который научился отлично стрелять из лука.
            Третий игрок. Имя: Пупа. Биография: очень сильный орк.
            Опиши начальное окружение сохранённых игроков исходя из жанра.
            Коротко опиши каждого игрока и его способности.
            Обязательно дай игрокам начальное задание или квест через случайного персонажа.
            """

    res = f"Жанр игры: {genre}. Описание мира: {intro}. В игре будет {len(players)} игрока.\n"
    for i in range(len(players)):
        player = players[i]
        res += f"{i + 1} игрок. Имя: {player['name']}. Биография: {player['bio']}.\n"
    res += """
        Опиши начальное окружение сохранённых игроков исходя из жанра.
        Коротко опиши каждого игрока и его способности.
        Обязательно дай игрокам начальное задание или квест через случайного персонажа.
    """

    return res


def message_template(sender_name, text):
    res = f"""
    Ходит {sender_name}. {sender_name} пытается: {text}.
    """
    return res

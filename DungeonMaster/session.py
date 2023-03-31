from langchain import PromptTemplate
from langchain.chat_models import ChatOpenAI

from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory, ConversationEntityMemory, CombinedMemory


class Session:

    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.5)
        self.is_ended = False

        self.know_graph_memory = ConversationEntityMemory(llm=self.llm, input_key="input")
        self.summary_buffer_memory = ConversationSummaryBufferMemory(llm=self.llm, input_key="input", ai_prefix="",
                                                                     human_prefix="")
        self.memory = CombinedMemory(memories=[self.know_graph_memory, self.summary_buffer_memory])

        _DEFAULT_TEMPLATE = """
        Ты ведущий онлайн рпг игры, ты знаешь все книги, статьи и другие материалы.
        Ты должен вести игру мультиплеерную игру, похожую на d&d и ai dungeon.
        Не упоминай о себе, создай полное погружение в игру.
        Не используй вне игровые термины.
        Создавай случайные события, такие как засады, сражения, ловушки.
        Следуй заданному жанру.
        
        Не делай выбор за игроков. Когда начинается сражение передавай управление игроку.
        Не выполняй действия за игроков.
        
        Намекай на правильное решение и дальнейший путь.
        
        Контекст:
        {entities}
        
        Прошедшие события:
        {history}
        
        Оценивай возможность 
        действий игрока и выводи результат, учитывая его способности и оружее, а также контекст и прошедшие события.
        Пиши результат действий игрока после "Результат:".
        Игрок может выполнить только одно действие за ход.
        Если ты считаешь, что игру можно назвать оконченной, цель была достигнута, то напиши: "ИГРА ОКОНЧЕНА".
    
        {input}
        
        Результат:
    """

        self.PROMPT = PromptTemplate(
            input_variables=["entities", "history", "input"], template=_DEFAULT_TEMPLATE
        )

        self.chain = ConversationChain(
            llm=self.llm,
            verbose=True,
            memory=self.memory,
            prompt=self.PROMPT
        )

    def get_using_GPT(self, input_text):
        gpt_res = self.chain.run(input_text)
        if "ИГРА ОКОНЧЕНА" in gpt_res:
            self.is_ended = True
        return {"text": gpt_res, "game_end": self.is_ended}

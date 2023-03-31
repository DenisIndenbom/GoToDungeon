from langchain.chat_models import ChatOpenAI
from langchain import PromptTemplate, LLMChain
from langchain.llms import OpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)
from langchain.chains import ConversationChain
from langchain.memory import ConversationKGMemory, ConversationSummaryBufferMemory, ConversationEntityMemory, CombinedMemory
from langchain.agents import initialize_agent, Tool


class Session:

    def __init__(self):
        self.chat = ChatOpenAI(temperature=1)
        self.is_ended = False

        self.know_graph_memory = ConversationEntityMemory(llm=OpenAI(), input_key="input")
        self.summary_buffer_memory = ConversationSummaryBufferMemory(llm=self.chat, input_key="input")
        self.memory = CombinedMemory(memories=[self.know_graph_memory, self.summary_buffer_memory])

        _DEFAULT_TEMPLATE = """
        Ты ведущий онлайн рпг игры, ты знаешь все книги, статьи и другие материалы.
        Ты должен вести игру мультиплеерную игру, похожую на d&d и ai dungeon.
        Не упоминай о себе, создай полное погружение в игру.
        Не используй вне игровые термины.
        Создавай случайные события, такие как засады, сражения, ловушки.
        Следуй заданному жанру.
        
        Не делай выбор за игроков. Когда начинается сражение передавай управление игроку.
        
        Намекай на правильное решение и дальнейший путь.
        
        Контекст:
        {entities}
        
        Прошедшие события:
        {history}
        
        Оценивай возможность 
        действий игрока и выводи результат, учитывая его способности и оружее, а также контекст и прошедшие события.
        Игрок может выполнить только одно действие за ход.
    
        {input}
        
        Результат:
"""

        self.tools = [
            Tool(
                name="Окончание игры",
                func=self.end_game,
                description="Запусти эту функцию, если игру можно назвать оконченной, все поставленные цели были выполнены"
            )
        ]

        self.PROMPT = PromptTemplate(
            input_variables=["entities", "history", "input"], template=_DEFAULT_TEMPLATE
        )

        self.chain = ConversationChain(
            llm=self.chat,
            verbose=True,
            memory=self.memory,
            prompt=self.PROMPT
        )

    def get_using_GPT(self, input_text):
        gpt_res = self.chain.run(input_text)
        return {"text": gpt_res, "game_end": self.is_ended}

    def end_game(self, query):
        self.is_ended = True
        return 'Игра окончена'

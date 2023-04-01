from langchain import PromptTemplate
from langchain.chat_models import ChatOpenAI

from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory, ConversationEntityMemory, CombinedMemory


class Session:
    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.5)
        self.is_ended = False
        self.is_first = True

        self.know_graph_memory = ConversationEntityMemory(llm=self.llm, input_key="input")
        self.summary_buffer_memory = ConversationSummaryBufferMemory(llm=self.llm, input_key="input", ai_prefix="",
                                                                     human_prefix="")
        self.memory = CombinedMemory(memories=[self.know_graph_memory, self.summary_buffer_memory])

        _DEFAULT_TEMPLATE = """
Ты ведущий ролевой игры, похожей на dnd и aidungeon. Ты знаешь все книги, статьи, фильмы и т.д. Не упоминай о себе, не упоминай не игровых терминов для полного погружения в игру.
У каждого игрока есть свой персонаж. Игроки ходят по очереди, описывая свои действия текстом. 
Твоя задача – на каждом шаге моделировать как реагирует мир на действия игроков. Присылай в ответ реакции других персонажей и существ, а также описывай, что видят персонажи игроков. Учитывай особенности указанного жанра, особенностей персонажей и контекста. Не выполняй никаких действий и не принимай решений за игроков, только моделируй окружение.
Твой ответ должен состоять менее чем из 5 предложений, пиши кратко, лаконично и интересно. Твои сюжеты должны быть вовлекающими и захватывающими.
Контекст:
{entities}
Прошедшие события:
{history}
Сейчас:
{input}
Если ты считаешь, что игру можно назвать оконченной, цель была достигнута, то напиши: "ИГРА ОКОНЧЕНА".
        """

        _START_TEMPLATE = """
Ты ведущий ролевой игры, похожей на dnd и aidungeon. Ты знаешь все книги, статьи, фильмы и т.д. Не упоминай о себе, не упоминай не игровых терминов для полного погружения в игру.
У каждого игрока есть свой персонаж. Игроки ходят по очереди, описывая свои действия текстом. 
Твоя задача – на каждом шаге моделировать как реагирует мир на действия игроков. Присылай в ответ реакции других персонажей и существ, а также описывай, что видят персонажи игроков. Учитывай особенности указанного жанра, особенностей персонажей и контекста. Не выполняй никаких действий и не принимай решений за игроков, только моделируй окружение.
Пиши лаконично и интересно. Твои сюжеты должны быть вовлекающими и захватывающими. Твой ответ должен состоять менее чем из 10 предложений.
{entities}
{history}
{input}
"""

        self.PROMPT = PromptTemplate(
            input_variables=["entities", "history", "input"], template=_DEFAULT_TEMPLATE
        )
        self.START_PROMPT = PromptTemplate(
            input_variables=["entities", "history", "input"], template=_START_TEMPLATE
        )

        self.chain = ConversationChain(
            llm=self.llm,
            verbose=False,
            memory=self.memory,
            prompt=self.START_PROMPT
        )

    def get_using_GPT(self, input_text) -> dict:
        gpt_res = self.chain.run(input_text).lstrip(':')

        if "игра окончена" in gpt_res.lower():
            self.is_ended = True

        if self.is_first:
            self.chain.prompt = self.PROMPT
            self.is_first = False

        return {"text": gpt_res, "game_end": self.is_ended}
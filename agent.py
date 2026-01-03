from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from config import get_settings
from tools import tools


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]


def create_agent():
    settings = get_settings()
    model = ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key
    ).bind_tools(tools)

    def call_model(state: AgentState):
        response = model.invoke(state["messages"])
        return {"messages": [response]}

    builder = StateGraph(AgentState)
    builder.add_node("agent", call_model)
    builder.add_node("tools", ToolNode(tools))
    builder.set_entry_point("agent")
    builder.add_conditional_edges("agent", tools_condition)
    builder.add_edge("tools", "agent")

    return builder.compile()


graph = create_agent()

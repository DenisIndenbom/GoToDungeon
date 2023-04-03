FROM python:latest

WORKDIR /dungeon_master

COPY requirements.txt requirements.txt

COPY dungeon_master_app.py dungeon_master_app.py
COPY session.py session.py
COPY session_manager.py session_manager.py
COPY input_templates.py input_templates.py

RUN pip install -r requirements.txt

COPY .env .env
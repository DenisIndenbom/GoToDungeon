FROM python:latest

WORKDIR /web

COPY requirements.txt requirements.txt

COPY ./static ./static
COPY templates templates

COPY web_server_app.py web_server_app.py

RUN pip install -r requirements.txt

COPY .env .env
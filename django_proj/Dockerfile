FROM python:3.10-slim-buster

WORKDIR /DOCK_APP

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver"]
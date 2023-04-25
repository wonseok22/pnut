FROM python:3
ENV PYTHONUNBUFFERED 1
RUN apt-get -y update
RUN apt-get -y install vim

ADD . /srv/pnut
WORKDIR /srv/pnut
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
EXPOSE 8000
#CMD ["uwsgi", "--ini", "uwsgi/uwsgi.ini"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
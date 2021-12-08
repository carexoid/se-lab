FROM python:3.8-alpine

WORKDIR /back

RUN apk --update add build-base libffi-dev openssl-dev
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
CMD python3 -m flask run --host=0.0.0.0

FROM node:14-slim

WORKDIR /front
RUN npm install -g serve
COPY . .
RUN npm --prefix front/ install
RUN npm --prefix front/ run build
CMD serve -s front/build -l tcp://0.0.0.0:8080

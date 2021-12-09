FROM node:14-slim

WORKDIR /front
RUN npm install -g serve
COPY ./front/package.json ./front/package.json
COPY ./front/package-lock.json ./front/package-lock.json
RUN npm --prefix front/ install
COPY . .
RUN npm --prefix front/ run build
CMD serve -s front/build -l tcp://0.0.0.0:8080

FROM node:18

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY main.js /app/main.js
COPY action-assistant /app/action-assistant
COPY dialog-assistant /app/dialog-assistant

EXPOSE 5000

CMD ["node", "/app/main.js"]

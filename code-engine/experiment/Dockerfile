FROM node:18

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY main.js /app/main.js
COPY watson-experiments-cf /app/watson-experiments-cf

CMD ["node", "/app/main.js"]

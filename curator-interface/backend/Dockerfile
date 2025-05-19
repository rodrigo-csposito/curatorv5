FROM node:18

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY server /app/server
COPY build /app/build
COPY code-engine /app/code-engine

ENV NODE_ENV production
ENV PORT 5000

EXPOSE 5000

CMD ["npm", "start"]
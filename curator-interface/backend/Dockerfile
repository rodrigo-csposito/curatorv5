FROM node:18 AS frontend
WORKDIR /app
COPY client ./client
RUN cd client && npm install && npm run build

FROM node:18
WORKDIR /app

COPY backend/package.json /app/backend/
RUN cd backend && npm install

COPY backend /app/backend

COPY --from=frontend /app/client/build /app/backend/client/build

ENV NODE_ENV production
ENV PORT 5000
EXPOSE 5000

CMD ["node", "backend/server/server.js"]

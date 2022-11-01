FROM node:18.7.0
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY ./dist/ ./

CMD [ "node", "backend/app.js" ]
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chown -R node:node /app

EXPOSE 5000

USER node

CMD ["npm", "start"]
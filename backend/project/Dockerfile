FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

RUN mkdir -p dist/assets && cp -r assets/*.csv dist/assets/

EXPOSE 3001

CMD ["node", "dist/server.js"]

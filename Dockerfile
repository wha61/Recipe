FROM node

WORKDIR /usr/src/app

COPY . .

RUN npm install --legacy-peer-deps
RUN npm install @popperjs/core

EXPOSE 3001

CMD ["npm", "start"]

FROM node:14

WORKDIR /usr/src/doss

COPY package.json package.json

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
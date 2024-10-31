FROM node:lts-alpine

RUN apk --no-cache add curl

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . .

RUN npm install
RUN npm run build

ENTRYPOINT ["npm", "run", "start-docker"]

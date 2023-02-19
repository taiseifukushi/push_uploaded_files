FROM node:18.7.0-alpine3.15
WORKDIR /work

COPY . ./
RUN yarn install
RUN yarn build

RUN apk update \
    apk --no-cache add curl

EXPOSE 8080

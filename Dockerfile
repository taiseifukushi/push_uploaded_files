FROM node:18.7.0-alpine3.15
WORKDIR /work

COPY . ./
RUN npm install
RUN npm run build

RUN apk update \
    apk --no-cache add curl

EXPOSE 3001

# CMD ["node", "./out/main/index.js"]

FROM node:16.14.2
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN npm build
CMD [ "npm","start" ]
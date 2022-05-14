FROM node:16.14.2
ARG HOM_HOST_NAME
ENV HOM_HOST_NAME ${HOM_HOST_NAME}
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN rm -r ./test
RUN npm i
RUN npm run build
CMD [ "npm", "start" , "$HOM_HOST_NAME"]
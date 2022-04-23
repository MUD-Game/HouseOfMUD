FROM node:16.14.2
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install --legacy-peer-deps
RUN npm i serve --global
RUN npm run build
CMD ["serve","-s","build"]
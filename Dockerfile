FROM node:16.14.2
WORKDIR /app
COPY ./frontend/package.json ./frontend
COPY ./frontend/package-lock.json ./frontend
COPY ./ ./
WORKDIR /app/backend/supervisor
RUN npm install --legacy-peer-deps
RUN npm run build
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm i serve --global
RUN npm run build
CMD ["serve","-s","build"]
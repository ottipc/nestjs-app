FROM node:18-alpine
ENV NPM_CONFIG_PROGRESS=false
ENV NPM_CONFIG_LOGLEVEL=silent
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --prefer-offline
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

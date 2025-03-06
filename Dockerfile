# Basisimage: Node.js
FROM node:18-alpine

# Arbeitsverzeichnis
WORKDIR /app

# Abhängigkeiten kopieren
COPY package*.json ./

# Installieren
RUN npm install

# Restlichen Code kopieren
COPY . .

# App bauen
RUN npm run build

# Port freigeben
EXPOSE 3000

# App starten
CMD ["npm", "run", "start:prod"]

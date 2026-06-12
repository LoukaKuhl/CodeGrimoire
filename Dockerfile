# Étape build : compile le TypeScript (backend/ vers dist/)
FROM node:20-alpine AS build
WORKDIR /app

# Installe toutes les dépendances (dev incluses) pour pouvoir compiler
COPY package.json package-lock.json ./
RUN npm ci

# Copie le code source et lance le build TypeScript (npm run build => tsc)
COPY . .
RUN npm run build

# Étape runtime : image légère ne contenant que le code compilé et les deps de prod
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# N'installe que les dépendances de production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copie uniquement la sortie compilée depuis l'étape build
COPY --from=build /app/dist ./dist

# Le serveur écoute sur le port 3000 (cf. backend/server.ts)
EXPOSE 3000

# Démarre le serveur compilé (npm start => node dist/server.js)
CMD ["node", "dist/server.js"]

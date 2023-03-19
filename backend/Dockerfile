# Берем слепок из образа node
# С помощью директивы AS можно дать образу имя
FROM node:18-alpine AS builder
# указываем рабочую директорию и сохраняем новый слой
WORKDIR /app
# установка зависимостей
# астериск ("*") по возможности скопирует оба файла: package.json и package-lock.json
# тот же символ делает копирование опциональным, т. е. без файла сборка не упадёт
COPY package*.json ./
# Устанавливаем зависимости
RUN npm i --legacy-peer-deps
# Копируем исходный код и собираем приложение
COPY . .
RUN npm run build
# после сборки приложения внутри контейнера нам больше не нужен исходный код
RUN rm -rf ./src 


FROM node:18-alpine AS backend
# указываем рабочую директорию и сохраняем новый слой
WORKDIR /app
# С помощью параметера --from указываем, что копировать нужно из образа builder
# Копируем package.json и package-lock.json (потребуются для установки зависимостей)
COPY --from=builder /app/package*.json ./
# Флаг --omit=dev означает - "не ставить devDependencies"
# они не нужны нам в продакшен-окружении
RUN npm i --legacy-peer-deps --omit=dev && npm i -g pm2
# Копируем директорию со сборкой приложения
COPY --from=builder /app/dist ./dist/
COPY ./ecosystem.config.js .
EXPOSE 4000
# Указываем команду для запуска приложения
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
#CMD ["node", "./dist/main.js" ]
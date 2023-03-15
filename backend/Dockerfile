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
RUN npm li --legacy-peer-deps
# Копируем исходный код и собираем приложение
COPY . .
RUN npm run build
# после сборки приложения внутри контейнера нам больше не нужен исходный код
RUN rm -rf ./src 


FROM node:18-alpine AS production
# указываем рабочую директорию и сохраняем новый слой
WORKDIR /app
# С помощью параметера --from указываем, что копировать нужно из образа builder
# Копируем package.json и package-lock.json (потребуются для установки зависимостей)
COPY --from=builder /app/package*.json ./
# Флаг --omit=dev означает - "не ставить devDependencies"
# они не нужны нам в продакшен-окружении
RUN npm i --legacy-peer-deps --omit=dev
# Копируем директорию со сборкой приложения
COPY --from=builder /app/dist ./dist/
EXPOSE 3000
# Указываем команду для запуска приложения
CMD ["node", "./dist/main.js" ]
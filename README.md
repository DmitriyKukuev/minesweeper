# Онлайн сапер на Laravel и Vue

## Команды docker

Сборка docker-контейнеров:
```shell
docker compose -f ./docker/docker-compose.yml build
```

Запуск docker-контейнеров:
```shell
docker compose -f ./docker/docker-compose.yml up -d
```

Остановка docker-контейнеров:
```shell
docker compose -f ./docker/docker-compose.yml down
```

## Сборка фронтенда
Нужны node.js, pnpm

Установить npm пакеты:
```shell
pnpm install --frozen-lockfile
```

Сборка в режиме разработки:
```shell
npm run dev
```

Сборка в продакшн:
```shell
npm run build
```

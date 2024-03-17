##################
# Docker compose
##################

dc-build:
	docker-compose -f ./docker/docker-compose.yml build

dc-start:
	docker-compose -f ./docker/docker-compose.yml start

dc-stop:
	docker-compose -f ./docker/docker-compose.yml stop

dc-up:
	docker-compose -f ./docker/docker-compose.yml up -d

dc-ps:
	docker-compose -f ./docker/docker-compose.yml ps

dc-logs:
	docker-compose -f ./docker/docker-compose.yml logs -f

dc-down:
	docker-compose -f ./docker/docker-compose.yml down


##################
# App
##################

app-bash:
	docker-compose -f ./docker/docker-compose.yml exec -u www-data php-fpm bash

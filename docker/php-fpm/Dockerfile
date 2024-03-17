FROM php:8.1.0-fpm-alpine

# Install packages
RUN apk add --no-cache curl git build-base zlib-dev oniguruma-dev autoconf bash libpq-dev

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql && \
    docker-php-ext-install pdo_pgsql && \
    docker-php-ext-install sockets && \
    docker-php-ext-configure sockets && \
    docker-php-ext-enable sockets

# Configure non-root user.
ARG PUID=1000
ARG PGID=1000
RUN apk --no-cache add shadow && \
    groupmod -o -g ${PGID} www-data && \
    usermod -o -u ${PUID} -g www-data www-data

# Source code
COPY ./ /var/www
WORKDIR /var/www

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
#RUN composer install --no-interaction

CMD php-fpm

EXPOSE 9000

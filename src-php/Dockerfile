FROM php:7-apache

RUN apt-get update -y && apt-get install -y openssl zip unzip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install pdo bcmath

WORKDIR /app

COPY composer.* ./

RUN composer install --no-scripts --no-autoloader

COPY . /app

RUN composer dump-autoload --optimize

RUN find storage -type d -exec chmod 777 {} \;

COPY apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

EXPOSE 80
CMD ["apache2-foreground"]


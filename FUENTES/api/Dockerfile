FROM php:7.2-apache

WORKDIR /

ENV ACCEPT_EULA=Y

# Habilitamos mods de Apache
RUN a2enmod headers
RUN a2enmod rewrite

# Microsoft SQL Server Prerequisites
RUN apt-get update \
&& apt-get install -y gnupg \
&& curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
&& curl https://packages.microsoft.com/config/debian/9/prod.list \
> /etc/apt/sources.list.d/mssql-release.list \
&& apt-get install -y --no-install-recommends locales apt-transport-https \
&& echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
&& locale-gen \
&& apt-get update \
&& apt-get -y install --no-install-recommends unixodbc-dev msodbcsql17=17.3.1.1-1


RUN apt-get update \
&& apt-get install -y wget \
&& wget http://security.debian.org/debian-security/pool/updates/main/o/openssl1.0/libssl1.0.2_1.0.2u-1~deb9u4_amd64.deb \
    && dpkg -i libssl1.0.2_1.0.2u-1~deb9u1_amd64.deb



# Extensiones PHP y php.ini
RUN apt-get install -y libpq-dev && \
pecl install sqlsrv && \
docker-php-ext-enable sqlsrv && \
docker-php-ext-install pgsql mysqli && \
mkdir /app && \
mv /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini



RUN set -ex \
	&& apt-get update && apt-get install -y \
		curl \
		g++ \
		openssl \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
		libicu-dev \
		libxml2-dev \
		libcurl4-openssl-dev \
		libsodium-dev \
    && docker-php-ext-install iconv json intl xml gettext mbstring soap zip curl mysqli pdo pdo_mysql \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install gd \
	&& docker-php-ext-configure bcmath \
	&& docker-php-ext-install bcmath \
	&& pecl install apcu-beta \
	&& pecl install libsodium \
	&& docker-php-ext-enable sodium




RUN apt-get update
# make sure that locales package is available
RUN apt-get install --reinstall -y locales
# uncomment chosen locale to enable it's generation
RUN sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen
# generate chosen locale
RUN locale-gen en_US.UTF-8
# set system-wide locale settings
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US
ENV LC_ALL en_US.UTF-8
# verify modified configuration
RUN dpkg-reconfigure --frontend noninteractive locales

COPY . /var/www/html

RUN mkdir -p /var/www/html/logs

RUN mkdir -p /var/www/html/planillas

RUN chmod -R 777 /var/www/html/planillas




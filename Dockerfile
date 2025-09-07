FROM php:8.3-apache

# Abilita mod_rewrite e imposta la docroot su /var/www/html/public
RUN a2enmod rewrite && \
    sed -i 's#DocumentRoot /var/www/html#DocumentRoot /var/www/html/public#' /etc/apache2/sites-available/000-default.conf && \
    sed -i 's#<Directory /var/www/>#<Directory /var/www/html/public/>#' /etc/apache2/apache2.conf && \
    printf "\n<Directory /var/www/html/public/>\n    AllowOverride All\n</Directory>\n" >> /etc/apache2/apache2.conf

# Config PHP minima (override)
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Vhost opzionale (se vuoi personalizzarlo ulteriormente)
COPY docker/vhost.conf /etc/apache2/sites-available/000-default.conf

# Copia codice (per ambienti di produzione)
COPY . /var/www/html

# Sicurezza/permessi
RUN chown -R www-data:www-data /var/www/html

# Porta esposta
EXPOSE 80

# Healthcheck basilare
HEALTHCHECK --interval=30s --timeout=3s CMD curl -fsS http://localhost/ || exit 1

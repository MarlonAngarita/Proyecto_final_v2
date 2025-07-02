# Dockerfile para MySQL DB
FROM mysql:8.0
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=kutsadb
COPY kutsadb_v3.sql /docker-entrypoint-initdb.d/
EXPOSE 3306

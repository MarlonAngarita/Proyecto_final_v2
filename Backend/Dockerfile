# Dockerfile para Django Backend
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev pkg-config && rm -rf /var/lib/apt/lists/*
COPY Backend/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .
COPY ../kustsa ../kustsa
EXPOSE 8000
CMD ["gunicorn", "kustsa.wsgi:application", "--bind", "0.0.0.0:8000"]


FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System dependencies for dlib, OpenCV and SQL Server ODBC
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    curl \
    gnupg \
    unixodbc \
    unixodbc-dev \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Microsoft ODBC Driver 18
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
    | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list \
    > /etc/apt/sources.list.d/mssql-release.list \
    && sed -i 's#deb \[arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-prod.gpg\]#deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-prod.gpg]#' /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN grep -v -i '^msvc-runtime==' requirements.txt > requirements-linux.txt \
    && pip install --upgrade pip \
    && pip install -r requirements-linux.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
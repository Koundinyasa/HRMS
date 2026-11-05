FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TZ=Asia/Kolkata

# Install system libraries, ODBC tools and configure IST timezone
RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata \
    curl \
    ca-certificates \
    gnupg \
    unixodbc \
    odbcinst \
    libgssapi-krb5-2 \
    libxcb1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && ln -snf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone \
    && curl -sSL -o /tmp/packages-microsoft-prod.deb \
       https://packages.microsoft.com/config/debian/13/packages-microsoft-prod.deb \
    && dpkg -i /tmp/packages-microsoft-prod.deb \
    && rm /tmp/packages-microsoft-prod.deb \

# ==========================================
# Builder stage
# ==========================================
FROM python:3.11-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
COPY face_recognition-1.3.0-py2.py3-none-any.whl .

# Install application dependencies and patched packaging tools
RUN grep -v -i '^msvc-runtime==' requirements.txt > requirements-linux.txt \
    && python -m pip install --no-cache-dir --prefix=/install -r requirements-linux.txt \
    && python -m pip install --no-cache-dir --no-deps --prefix=/install face_recognition-1.3.0-py2.py3-none-any.whl \
    && rm -rf \
        /install/lib/python3.11/site-packages/setuptools \
        /install/lib/python3.11/site-packages/setuptools-*.dist-info \
        /install/lib/python3.11/site-packages/wheel \
        /install/lib/python3.11/site-packages/wheel-*.dist-info \
    && python -m pip install --no-cache-dir --prefix=/install --no-deps setuptools==82.0.0 wheel==0.46.3

# ==========================================
# Production stage
# ==========================================
FROM python:3.11-slim-bookworm AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Asia/Kolkata

WORKDIR /app

# Runtime system dependencies and India timezone
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    tzdata \
    unixodbc \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    libgtk-3-0 \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Microsoft ODBC Driver 18
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
    | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list \
    > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .

RUN grep -v -E "^(msvc-runtime|face-recognition)==" requirements.txt > requirements-linux.txt \
    && pip install --no-cache-dir --default-timeout=300 --retries=10 -r requirements-linux.txt \
    && pip install --no-cache-dir --default-timeout=300 --retries=10 --no-deps "face-recognition==1.3.0" \
    && python -m pip install --no-cache-dir \
       "setuptools==80.10.2" \
       "wheel>=0.46.2"

# Verify timezone, face-recognition dependencies and SQL Server ODBC driver
RUN python -c "import time, datetime; print('Timezone:', time.tzname); print('Local time:', datetime.datetime.now().astimezone().isoformat()); assert time.strftime('%z') == '+0530'" \
    && python -c "import pkg_resources, face_recognition_models, dlib, face_recognition, cv2; print('Face recognition dependencies OK'); print('dlib:', dlib.__version__); print('OpenCV:', cv2.__version__)" \
    && python -c "import pyodbc; print('pyodbc version:', pyodbc.version); print('ODBC drivers:', pyodbc.drivers()); assert 'ODBC Driver 18 for SQL Server' in pyodbc.drivers(); print('SQL Server ODBC Driver OK')"

# Copy application
COPY . .

# Remove local Windows virtual environments copied into the image
RUN rm -rf /app/venv /app/.venv

EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
# Remove vulnerable packaging tools inherited from the base image
RUN rm -rf \
    /usr/local/lib/python3.11/site-packages/setuptools \
    /usr/local/lib/python3.11/site-packages/setuptools-*.dist-info \
    /usr/local/lib/python3.11/site-packages/wheel \
    /usr/local/lib/python3.11/site-packages/wheel-*.dist-info

# Copy patched application dependencies from builder
COPY --from=builder /install/ /usr/local/

# Remove pip but retain patched setuptools and wheel
RUN rm -rf \
    /usr/local/lib/python3.11/site-packages/pip \
    /usr/local/lib/python3.11/site-packages/pip-*.dist-info \
    /usr/local/bin/pip \
    /usr/local/bin/pip3 \
    /usr/local/bin/pip3.11 \
    /usr/local/bin/easy_install*

COPY . .

EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]

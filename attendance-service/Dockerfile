# ==========================================
# Builder stage
# ==========================================
FROM python:3.11-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies
COPY requirements.txt .

# Install application dependencies
RUN grep -vi '^msvc-runtime==' requirements.txt > requirements-linux.txt \
    && pip install --no-cache-dir --prefix=/install -r requirements-linux.txt \
    && pip install --no-cache-dir --no-deps --prefix=/install face-recognition==1.3.0

# Remove old packaging tools and install updated versions
RUN rm -rf \
    /install/lib/python3.11/site-packages/setuptools \
    /install/lib/python3.11/site-packages/setuptools-*.dist-info \
    /install/lib/python3.11/site-packages/wheel \
    /install/lib/python3.11/site-packages/wheel-*.dist-info \
    && python -m pip install --no-cache-dir --prefix=/install --no-deps \
    setuptools==80.10.2 wheel==0.46.3


# ==========================================
# Production stage
# ==========================================
FROM python:3.11-slim-bookworm AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Asia/Kolkata

WORKDIR /app

# Update Debian packages and install runtime dependencies
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
    tzdata \
    ca-certificates \
    curl \
    gnupg \
    unixodbc \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libxcb1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Microsoft ODBC Driver 18
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
       | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list \
       > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 \
    && apt-get purge -y --auto-remove curl gnupg \
    && rm -rf /var/lib/apt/lists/*

# Remove vulnerable packaging tools inherited from base image
RUN rm -rf \
    /usr/local/lib/python3.11/site-packages/setuptools \
    /usr/local/lib/python3.11/site-packages/setuptools-*.dist-info \
    /usr/local/lib/python3.11/site-packages/wheel \
    /usr/local/lib/python3.11/site-packages/wheel-*.dist-info

# Copy updated Python dependencies from builder
COPY --from=builder /install/ /usr/local/

# Remove pip while retaining updated setuptools and wheel
RUN rm -rf \
    /usr/local/lib/python3.11/site-packages/pip \
    /usr/local/lib/python3.11/site-packages/pip-*.dist-info \
    /usr/local/bin/pip \
    /usr/local/bin/pip3 \
    /usr/local/bin/pip3.11 \
    /usr/local/bin/easy_install*

# Copy application files
COPY . .

EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
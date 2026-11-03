
FROM python:3.11-slim-bookworm

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Install OpenCV runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libxcb1 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies
COPY requirements.txt .

# Install Linux-compatible Python dependencies
RUN grep -vi '^msvc-runtime==' requirements.txt > requirements-linux.txt \
    && pip install --no-cache-dir -r requirements-linux.txt

# Upgrade Python packaging dependencies
RUN pip install --no-cache-dir --upgrade \
    setuptools==80.10.2 \
    jaraco.context==6.1.0 \
    wheel==0.46.2

# Install face recognition without replacing its dependencies
RUN pip install --no-cache-dir --no-deps face-recognition==1.3.0

# Copy application files
COPY . .

# Attendance service port
EXPOSE 5000

# Start FastAPI application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]

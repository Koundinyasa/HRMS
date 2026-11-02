FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install OpenCV runtime libraries
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libxcb1 \
    && rm -rf /var/lib/apt/lists/*

# Install Linux-compatible Python dependencies
COPY requirements.txt .

RUN grep -vi '^msvc-runtime==' requirements.txt > requirements-linux.txt \
    && pip install --no-cache-dir -r requirements-linux.txt

# Upgrade vulnerable Python packages
RUN pip install --no-cache-dir --upgrade \
    jaraco.context==6.1.0 \
    wheel==0.46.2

# Install face recognition
RUN pip install --no-cache-dir --no-deps face-recognition==1.3.0

# Remove setuptools and its bundled vulnerable package copies
RUN rm -rf \
    /usr/local/lib/python3.11/site-packages/setuptools \
    /usr/local/lib/python3.11/site-packages/setuptools-*.dist-info

# Copy application files
COPY . .

EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
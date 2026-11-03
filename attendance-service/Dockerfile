FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install required Linux libraries for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libxcb1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies without compiling dlib from source
RUN grep -v -E "^(msvc-runtime|face-recognition)==" requirements.txt > requirements-linux.txt \
    && pip install --no-cache-dir \
       --default-timeout=300 \
       --retries=10 \
       -r requirements-linux.txt \
    && pip install --no-cache-dir \
       --default-timeout=300 \
       --retries=10 \
       --no-deps \
       "face-recognition==1.3.0" \
    && python -m pip install --no-cache-dir \
       --default-timeout=300 \
       --retries=10 \
       --upgrade \
       "setuptools>=80.10.2" \
       "jaraco.context>=6.1.0" \
       "wheel>=0.46.2"

# Verify Python dependencies
RUN python -m pip show setuptools jaraco.context wheel \
    && python -c "import dlib, face_recognition, cv2; print('dlib:', dlib.__version__); print('Face recognition imported successfully'); print('OpenCV:', cv2.__version__)"

# Copy application source
COPY . .

EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
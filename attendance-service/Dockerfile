# ==========================================================
# KTS-PEOPLE360 ATTENDANCE SERVICE
# Python 3.11 + Face Recognition + SQL Server ODBC 18
# ==========================================================

FROM python:3.11-slim-trixie

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TZ=Asia/Kolkata

# ----------------------------------------------------------
# Install system libraries, timezone and SQL Server ODBC
# ----------------------------------------------------------

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
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
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

# ----------------------------------------------------------
# Install Python dependencies
# ----------------------------------------------------------

COPY requirements.txt .

RUN grep -v -E "^(msvc-runtime|face-recognition)==" requirements.txt > requirements-linux.txt \
    && pip install --no-cache-dir --default-timeout=300 --retries=10 -r requirements-linux.txt \
    && pip install --no-cache-dir --default-timeout=300 --retries=10 --no-deps "face-recognition==1.3.0" \
    && python -m pip install --no-cache-dir \
       "setuptools==80.10.2" \
       "wheel>=0.46.2"

# ----------------------------------------------------------
# Verify timezone and Python dependencies
# ----------------------------------------------------------

RUN python -c "import time, datetime; print('Timezone:', time.tzname); print('Local time:', datetime.datetime.now().astimezone().isoformat()); assert time.strftime('%z') == '+0530'" \
    && python -c "import pkg_resources, face_recognition_models, dlib, face_recognition, cv2; print('Face recognition dependencies OK'); print('dlib:', dlib.__version__); print('OpenCV:', cv2.__version__)" \
    && python -c "import pyodbc; print('pyodbc version:', pyodbc.version); print('ODBC drivers:', pyodbc.drivers()); assert 'ODBC Driver 18 for SQL Server' in pyodbc.drivers(); print('SQL Server ODBC Driver OK')"

# ----------------------------------------------------------
# Copy attendance application
# ----------------------------------------------------------

COPY . .

# Remove any accidentally copied local Windows virtual environments
RUN rm -rf /app/venv /app/.venv

EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
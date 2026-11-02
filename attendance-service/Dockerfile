
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN grep -v "^msvc-runtime==" requirements.txt > requirements-linux.txt \
    && pip install --no-cache-dir -r requirements-linux.txt \
    && python -m pip install --no-cache-dir --upgrade \
       "jaraco.context>=6.1.0" \
       "wheel>=0.46.2"

COPY . .

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
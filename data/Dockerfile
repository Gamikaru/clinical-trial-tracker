# Dockerfile at the root of your_project/

# We use an official Python base image
FROM python:3.10-slim

# Create a working directory in the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy your entire project into the container
COPY . /app

# Expose port 8000 (FastAPI default)
EXPOSE 8000

# Run main.py with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.11.5
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt 
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY main.py /app/
COPY crypto.pkl /app/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
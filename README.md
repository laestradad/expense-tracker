# Expense Tracker App

A simple expense tracker built with **Python Flask** (backend) and **React** (frontend) with **PostgreSQL** as database. Users can track income and expenses, upload CSVs, view trends, and generate plots with **Plotly.js**.

## Features

- User authentication: register, login, change password, delete account  
- CRUD transactions with date, category and amount  
- Default categories:

| Name       | Type    |
|------------|--------|
| Salary     | income |
| Gift       | income |
| Other      | income |
| Food       | expense|
| Housing    | expense|
| Utilities  | expense|
| Transport  | expense|
| Health     | expense|
| Leisure    | expense|
| Other      | expense|

- CSV upload (downloadable from App, example format):
```
date,category,amount,comment
2025-01-01,Salary,1000,
2025-01-01,Gift,100,
2025-01-01,Other,50,casino
2025-01-01,Food,200,
2025-01-01,Housing,500,
2025-01-01,Utilities,100,
2025-01-01,Transport,50,
2025-01-01,Health,80,
2025-01-01,Leisure,50,
2025-01-01,Other,10,barber
```

- Account page:
  - Download CSV template  
  - Download all transactions (From Delete Account page)
- Dashboard:
  - View all transactions  
  - Monthly insights and totals  
  - Plots and trend data (Plotly.js)  

## Setup

### Backend

1. Create a `.env` file in `backend/` with the following variables:

    ```
    SECRET_KEY=<your_secret_key>

    JWT_SECRET_KEY=<your_secret_key>
    JWT_EXPIRATION=<expiration_in_sec>

    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=...
    DB_USER=...
    DB_PASSWORD=...
    ```

1. Setup PostgreSQL database and run migrations:

    ```bash
    psql -U <user> -d <dbname> -f migrations/init.sql
    ```

1. Create a virtual environment and install dependencies:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    venv\Scripts\activate     # Windows
    pip install -r requirements.txt
    ```

1. Start backend:
    ```bash
    flask run
    ```

### Frontend

1. Install dependencies:
    ```bash
    cd frontend
    npm install
    ```
1. Start frontend:
    ```bash
    npm run dev
    ```
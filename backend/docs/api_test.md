# API manual Ttest

This file contains example `curl` commands to manually test the API.

## 1. Authenticate
create a login.json file with your credentials
```json
{
  "username": "testUser",
  "password": "testPassword"
}
```
execute login request to get an access TOKEN
```bash
curl.exe -X POST http://127.0.0.1:5000/auth/login -H "Content-Type: application/json" -d @login.json
```
set the variable TOKEN to use it for the API testing
```bash
set TOKEN=eyJ0eX...
```

## Load available categories
GET CATEGORIES
```bash
curl.exe -X GET http://127.0.0.1:5000/api/categories -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" 
```

## CRUD transactions table
create a transaction.json and update.json files with example transactions
```json
{
  "category_id": 1,
  "amount": 20.0,
  "comment": "Dinner",
  "transaction_date": "2025-01-01"
}
```

CREATE TRANSACTION 
```bash
curl.exe -X POST http://127.0.0.1:5000/api/transactions -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d @transaction.json
```

UPDATE TRANSACTION BY ID
```bash
curl.exe -X PUT http://127.0.0.1:5000/api/transactions/1 -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d @update.json
```

DELETE TRANSACTION BY ID
```bash
curl.exe -X DELETE http://127.0.0.1:5000/api/transactions/1 -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" 
```

GET TRANSACTIONS
```bash
curl.exe -X GET http://127.0.0.1:5000/api/transactions -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
```

## Get insights from transactions for user logged in
TOTAL IN, TOTAL OUT
```bash
curl.exe -X GET http://127.0.0.1:5000/api/insights/inout?date=2025-01-01 -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" 
```

GET TOTALS BY CATEGORY
```bash
curl.exe -X GET http://127.0.0.1:5000/api/insights/categories?date=2025-01-01 -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" 
```

GET MONTHLY BALANCE
```bash
curl.exe -X GET http://127.0.0.1:5000/api/insights/balance?date=2025-01-01 -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" 
```

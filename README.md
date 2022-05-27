# ekuitti-backend

> Read documentation.md for more information (in finnish)

## Start local development
1. git clone / git pull
2. yarn install
3. yarn run dev

## Create and run a production build
1. yarn run build
2. yarn run start

## Connect a Azure Cosmos database
1. Create a Microsoft Azure account
2. Create a resource group inside the account
3. Create two Azure Cosmos DB accounts under the created resource group, name them **-dev and **-prod
4. Create a .env file in project root and update it with URI and PRIMARY KEY values from both Cosmos DB accounts.

## Other
1. (Optional) Update the PORT value to .env file, default is 8080
2. Update SECRET value to .env file, it is used for token creation when user logs in, can be any string value

### .env file required contents
```
PORT=""

DEV_DB_URI=""

DEV_DB_SECRET_KEY=""

PROD_DB_URI=""

PROD_DB_SECRET_KEY=""

SECRET=""
```

## Testing

### Check code formatting with eslint
yarn run lint

> (optional) download eslint realtime error checker for vscode https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

### Manual testing
Run requests from src/requests/--.rest

> (optional) download REST client for vscode https://marketplace.visualstudio.com/items?itemName=humao.rest-client

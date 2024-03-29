# ekuitti-backend

This is the backend-application for a PoC-software to demo eReceipts. The software as a whole focuses to showcase the different possibilities eReceipts offer to the eReceipt-recipient / buyer.

The frontend-application for this software is found in another repository located [here](https://github.com/JGynther/ekuitti-frontend) by [@JGynther](https://github.com/JGynther).

The software follows the princibles drafted for eReceipts by Finnish State Treasury. These princibles can be found in this [publication](https://vkazprodwordpressstacc01.blob.core.windows.net/wordpress/sites/10/2022/06/eKuitti-Saantokirja-v-1.0-230522.pdf) called eKuitin Sääntökirja - Minimiedellytykset eKuittidatan välittämiseen.

> Read [documentation.md](documentation.md) for more information about the backend structure (in finnish)

> Read [api-documentation](api-documentation.md) for more information about API routes provided by this backend

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

> How to create Azure account, resource group and Cosmos DB account: [link](https://docs.microsoft.com/fi-fi/azure/cosmos-db/sql/create-cosmosdb-resources-portal)

> There is no need to create databases or tables. This backend-software will initialize them on startup.

## Other
1. (Optional) Update the PORT value to .env file, default is 8080
2. (Optional) Update the FRONTURI value to .env file, default is http://localhost:3000
3. Update SECRET value to .env file, it is used for token creation when user logs in, can be any string value

### .env file required contents
```
PORT=""

DEV_DB_URI=""

DEV_DB_SECRET_KEY=""

PROD_DB_URI=""

PROD_DB_SECRET_KEY=""

SECRET=""

FRONTURI=""
```

## Testing

### Check code formatting with eslint
yarn run lint

> (optional) download eslint realtime error checker for vscode: [link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 

### Manual testing
Run requests from src/requests/--.rest

> (optional) download REST client for vscode [link](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 

#### To run requests which need a userid
1. Run GET request inside given .rest file and copy the value of "id" from response
2. Replace the @idVariable value in the same .rest file with the copied id value
3. Run requests in the .rest file which use {{idVariable}}

#### To run receipt requests which need a user to be logged in
1. Run POST request inside [login.rest](src/requests/login.rest) and copy the value of "token" from response.
2. Replace the @tokenVariable value inside receipt.rest request with the copied token value
3. Now run requests inside receipt.rest which use {{tokenVariable}}

> Make sure to change the json file accordingly in POST request when creating a new receipt, program will throw error if eAddresses do not match

#### Testing Cors policy
Cors policies are set differently for public router and other routers
These differences can be easily tested from any browser with following methods
1. Open any website (but not backend or frontend address)
2. Press F12 to open devtools
3. Open console tab
4. Input: fetch('http://localhost:8080/api/users')
> This will result in error because cors policy restricts connections from other urls than frontend or backend
5. Input: fetch('http://localhost:8080/api/public/receipts')
> This will not produce an error and instead will return a Promise with "status: 200". This is because public api cors policy allows all connections.

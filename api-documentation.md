# RESTAPIDocs

[//]: # (markdown template used: https://github.com/jamescooke/restapidocs/tree/master/examples)

Where full URLs are provided in responses they will be rendered as if
service is running on 'http://localhost:8080'.

## Public Endpoints

Public endpoints can be accessed from anywhere with no Authentication

* [Test public endpoint](#public-get) : `GET /api/public/receipts`
* [Create receipt](#public-post) : `POST /api/public/receipts`

## Cors Protected Endpoints

Cors Protected endpoints require no Authentication but can only be accessed from
frontend which by default is located at 'http://localhost:3000'

### Login related

* [Login](#login-post) : `POST /api/login/`

### User related

* [Show all users](#users-get) : `GET /api/users/`
* [Show user](#users-get-by-id) : `GET /api/users/:id`
* [Create user](#users-post) : `POST /api/users/`
* [Delete user](#users-delete-by-id) : `DELETE /api/users/:id`

### Receipt related

* [Delete receipt](#receipts-delete-by-id) : `DELETE /api/receipts/:id`

> Note: DELETE for receipts is only possible in development mode and thus requires no authorization

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above. Requests also need
to originate from sources specified by cors policy.

### Current User related

Each endpoint manipulates or displays information related to the User whose
Token is provided with the request:

> !!! USER RELATED ENDPOINTS SHOULD BE GIVEN AUTHORIZATION AND MOVED HERE !!!

### Receipt related

Endpoints for viewing and manipulating the Receipts that the Authenticated User
has permissions to access.

* [Show all test receipts](#receipts-get-test) : `GET /api/receipts/test`
* [Show all receipts](#receipts-get) : `GET /api/receipts`
* [Show all receipts forwarded by user](#receipts-get-forwarded) : `GET /api/receipts/forwarded`
* [Show all users that have shared receipts and the amount of receipts](#receipts-get-shared) : `GET /api/receipts/shared`
* [Show all receipts shared to user by specific user](#receipts-get-shared-by-eAddress) : `GET /api/receipts/shared/:eAddressId`
* [Show receipt](#receipts-get-by-id) : `GET /api/receipts/:id`
* [Create receipt](#receipts-post) : `POST /api/receipts`
* [Forward receipt to other user](#receipts-post-forwarded) : `POST /api/receipts/forwarded`

### Possible errors
* [Possible errors with authentication](#authentication-errors) : `invalid or expired token/cookie`
* [Possible errors with database](#database-errors) : `errors caught by the azure cosmos db`

[//]: # (Add specific documentation about each API use below)

---

# Public

## Public GET

Test the public API connection

**URL** : `/api/public/receipts`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

### Success Responses

**Condition** : Public API connection was successful

**Code** : `200 OK`

**Content** :

```json
{
  "success"
}
```

### Error Response

**Condition** : Connection to public API failed

**Code** : `-`

**Content** : net::ERR_CONNECTION_REFUSED

## Public POST

Used to create a new receipt through a public api endpoint

**URL** : `/api/public/receipts`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

* [Example typing](src/models/receipt.ts)

**Data example**

* [Example receipt](docs/single_fake_receipt1.json)

### Success Response

**Code** : `201 Created`

**Content**

```json
{
  "success"
}
```

### Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "receipt data is invalid"
}
```

---

# Login

## Login POST

Used to collect a Token for a registered User.

**URL** : `/api/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "username": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "username": "kayttaja1",
    "password": "sekret"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "token": "93144-b288eb1fdccbe4-6d6fc0f241a51-766ecd3d...",
  "username": "kayttaja1",
  "name": "User1"
}
```

### Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
  "error": "invalid username or password"
}
```

---

# Users

## Users GET

Used to get all users

**URL** : `/api/users`

**Method** : `GET`

**Auth required** : NO

## Users GET by ID

Used to get specific user by id

**URL** : `/api/users/:id`

**Method** : `GET`

**Auth required** : NO

## Users POST

Used to create a new user.

**URL** : `/api/users`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
  "username": "[string]",
  "name": "[optional string]",
  "password": "[string]",
  "eAddressId": "[unique string]"
}
```

**Data example**

```json
{
  "username": "kayttaja1",
  "name": "User1",
  "password": "sekret",
  "eAddressId": "did:example:123456789abcdefghi"
}
```

### Success Response

**Code** : `302 Found`

**Content example**

> Found. Redirecting to /

### Error Response

**Condition** : Multiple cases which check if some required parts of the user are missing or invalid

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "password missing"
}
```

#### Or

```json
{
  "error": "password too small"
}
```

#### Or

```json
{
  "error": "username missing"
}
```

#### Or

```json
{
  "error": "e-Address missing"
}
```

## Users DELETE by ID

Used to delete a specific user by id

**URL** : `/api/users/:id`

**Method** : `DELETE`

**Auth required** : NO

---

# Receipts

## Receipts DELETE by ID

Used to delete a specific receipt by id

**URL** : `/api/receipts/:id`

**Method** : `DELETE`

**Auth required** : NO

> Only used in development

## Receipts GET test

Used to show test receipt data

**URL** : `/api/receipts/test`

**Method** : `GET`

**Auth required** : NO

> Returns [Test receipts JSON file's contents](docs/fake_receipts.json)

## Receipts GET

Show all receipts where the current user is the owner

**URL** : `/api/receipts`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

### Success Responses

**Condition** : User has receipts

**Code** : `200 OK`

**Content example** :

* [Example response](docs/example_response1.json)

### Or

**Condition** : User has no receipts

**Code** : `200 OK`

**Content** :

```json
[]
```

## Receipts GET forwarded

Show all receipts that user has forwarded to other users

**URL** : `/api/receipts/forwarded`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

### Success Responses

**Condition** : User has forwarded receipts

**Code** : `200 OK`

**Content example** :

* [Example response](docs/example_response1.json)

### Or

**Condition** : User has no forwarded receipts

**Code** : `200 OK`

**Content** :

```json
[]
```

## Receipts GET shared

Show all users that have forwarded receipts to current user and also the amount of those receipts

**URL** : `/api/receipts/shared`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

### Success Responses

**Condition** : User has receipts shared to them

**Code** : `200 OK`

**Content example** :

```json
[
  {
    "name": "User3",
    "eAddressId": "did:example:123456789000000000",
    "sharedReceiptAmount": 1
  }
]
```

### Or

**Condition** : User has no receipts shared to them

**Code** : `200 OK`

**Content** :

```json
[]
```

## Receipts GET shared by eAddress

Show all receipts that are shared to the current user by specific eAddress holder

**URL** : `/api/receipts/shared/:eAddressId`

**URL Parameters** : `eAddressId=[string]` where `eAddressId` is the ID representation of the eAddress

**Method** : `GET`

**Auth required** : YES

**Permissions required** : `{}`

**Data**: `{}`

## Success Response

**Condition** : If eAddressId exists and eAddressId is not the same as current users

**Code** : `200 OK`

**Content example**

* [Example response](docs/example_response1.json)

### Or

**Condition** : If eAddressId does not exist or no receipts are shared to current user

**Code** : `200 OK`

**Content** :

```json
[]
```

## Error Responses

**Condition** : If eAddressId is the same as current users

**Code** : `400 Bad Request`

**Content** :
```json
{
  "error": "user cannot have receipts forwarded from themself"
}
```

## Notes

> For security reasons: Giving the same `200 OK` code for both conditions doesnt allow existing users to test for existence of eAddresses that exist but that they do not have access to.

## Receipts GET by ID

Show a single receipt that the user has access to

**URL** : `/api/receipts/:id`

**URL Parameters** : `id=[string]` where `id` is the ID given by Azure Cosmos DB to the receipt

**Method** : `GET`

**Auth required** : YES

**Permissions required** : `{}`

**Data**: `{}`

## Success Response

**Condition** : If receipt with id exists and user has access to view it

**Code** : `200 OK`

**Content example**

* [Example response](docs/example_response2.json)

## Error Responses

**Condition** : If `id` does not match any receipts

**Code** : `500 Internal Server Error`

**Content** :
```json
{
  "error": "database: receipt matching given id not found"
}
```

### Or

**Condition** : If eAddressId does exist but current user has no access

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "access denied: current user is not the owner of this receipt and it is not forwarded to anyone"
}
```

### Or

**Condition** : If eAddressId does exist but current user has no access but it is forwarded to someone else

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "access denied: receipt is not forwarded to current user"
}
```

## Notes

> Possible security issue: Giving too much information with different error messages, used now in development.

## Receipts POST

Used to create a new receipt.

**URL** : `/api/receipts`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

* [Example typing](src/models/receipt.ts)

**Data example**

* [Example receipt](docs/single_fake_receipt1.json)

### Success Response

**Code** : `302 Found`

**Content example**

> Found. Redirecting to /

### Error Response

**Condition** : Trying to create a receipt with eAddressId not matching the current user.

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "eAddress is not valid for current user"
}
```

### Or

**Condition** : Multiple cases which check if some required parts of the receipt are missing

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "eAddress is missing"
}
```

#### Or

```json
{
  "error": "merchant information is missing"
}
```

#### Or

```json
{
  "error": "product information is missing"
}
```

## Receipts POST forwarded

Used to forward an existing receipt to another user

**URL** : `/api/receipts/forwarded`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
  "receiptId": "[valid receipt ID]",
  "eAddressId": "[valid eAddressId]"
}
```

**Data example**

```json
{
  "receiptId": "2e8ea339-89e7-43...",
  "eAddressId": "did:other:ihgfedcba987654321"
}
```

### Success Response

**Code** : `302 Found`

**Content example**

> Found. Redirecting to /

### Error Response

**Condition** : eAddressId given is the same as the current user's

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "forwarding receipts to oneself is not allowed"
}
```

#### Or

**Condition** : Id given does not match any receipts

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "error": "database: no receipt with given id was found"
}
```

#### Or

**Condition** : eAddressId given does not match the current user's

**Code** : `400 Bad Request`

**Content** :

```json
{
  "error": "forwarding receipts is only allowed for the original owner of the receipt"
}
```

#### Or

**Condition** : eAddressId given does not match any users

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "error": "database: no user with given eAddress was found"
}
```

#### Or

**Condition** : eAddressId owner allready has had the receipt with given id forwarded to them

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "error": "database: user already has access to receipt"
}
```

---

# Possible errors

## Authentication errors

**Token example**

> Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vy...

**Condition** : token/cookie given is invalid or missing

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
  "error": "invalid token"
}
```

#### Or

**Condition** : token's set time to live has expired and new login is needed

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
  "error": "token expired"
}
```

## Database errors

**Condition** : provided id does not produce any hits in the database

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "error": "database: values matching given id not found"
}
```

#### Or

**Condition** : trying to post dublicate data to database, like eAddressId for users

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "error": "database: values must be unique"
}
```
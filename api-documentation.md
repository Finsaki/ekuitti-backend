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
* [Show all receipts shared to user by specific user](#receipts-get-shared) : `GET /api/receipts/shared/:eAddressId`
* [Show receipt](#receipts-get-by-id) : `GET /api/receipts/:id`
* [Create receipt](#receipts-post) : `POST /api/receipts`
* [Forward receipt to other user](#receipts-post-forwarded) : `POST /api/receipts/forwarded`

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

**Content example**

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

## Users GET by ID

## Users POST

## Users DELETE by ID

---

# Receipts

## Receipts DELETE by ID

## Receipts GET test

## Receipts GET

## Receipts GET forwarded

## Receipts GET shared

## Receipts GET by ID

## Receipts POST

## Receipts POST forwarded
# Post New Block

Web API POST endpoint to validate request.

**URL** : `/requestValidation`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

``` { "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" } ```
 
```json
{
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1544451269",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
    "validationWindow": 300
}
```

## Notes

* If the parameter `address` is empty it does return an error.

# Post New Block

Web API POST endpoint with JSON response that submits the Star information to be saved in the Blockchain.

**URL** : `/block`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
}
```
 
RESPONSE:

```json
{
    "hash": "9cd5651c8e82b6a9419a886a3a01bdc03026057f8a9b8d642865dccfd0eb09d2",
    "height": 32,
    "body": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1545734567",
    "previousBlockHash": "b1bbc36faa99a438e4f5f3bd2fe96f5236b915de7e115db021a24cf507916156"
}
```

## Notes

* If any of `address`, `dec`, `ra` and `story` parameters is empty it does return an error.

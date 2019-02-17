# Post New Block

Get star block by star block height.

**URL** : `/block/:[HEIGHT]`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

`height: 5`

RESPONSE
 
```json
{
    "hash": "21663d531699d85fe6d06d1b3490489bc8b1270782028f05bc89fad2a499c1db",
    "height": 5,
    "body": {
        "address": "1Nm7wN4JGH26FtS5Gm3G4Jh1tDUkduHgW6",
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1550381813",
    "previousBlockHash": "9e2f4ab3c75097b7f590d97d27f8b7b9e936f4dcf1d32b2c0b0834190ef2d0b5"
}
```

## Notes

* If the parameter `height` is empty it does return an error.
* The response includes entire star block contents along with the addition of star story decoded to ASCII.

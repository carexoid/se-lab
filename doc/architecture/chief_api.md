## Chief service API documentation

___
### Get all flights

`GET /flights`

Filtering results implemented via optional query parameters.
Possible parameters:


| Name | Type | Description |
|---|---|---|
| number | int | Flight number |
| arrival_at | string | Arrival time, format - "%Y-%m-%d %H:%M:%S" |
| departure_at | string | Departure time, format - "%Y-%m-%d %H:%M:%S" |
| duration | int | Flight duration |
| airport | string | Target airport name |
| business_remaining | int | Minimum amount of business tickets remaining on flight |
| econom_remaining | int | Minimum amount of econom tickets remaining on flight |

_**Example**_:

URI: `/flights?business_remaining=1`

Response:
```js
{
  "flights": [
    {
      "arrival_at": "Wed, 08 Dec 2021 22:12:00 GMT", 
      "business_remaining": 3, 
      "city": "Kyiv", 
      "departure_at": "Wed, 08 Dec 2021 18:00:00 GMT", 
      "direction": 2, 
      "distance": 1400, 
      "duration": 15120, 
      "econom_remaining": 0, 
      "id": 2, 
      "name": "Zhuliany"
    }, 
    {
      "arrival_at": "Thu, 02 Dec 2021 14:40:00 GMT", 
      "business_remaining": 1, 
      "city": "Frankfurt", 
      "departure_at": "Thu, 02 Dec 2021 12:55:00 GMT", 
      "direction": 3, 
      "distance": 700, 
      "duration": 6300, 
      "econom_remaining": 0, 
      "id": 3, 
      "name": "Frankfurt Airport"
    }
  ]
}
```


___
### Get flight by id

`GET /flights/{flight_id}`

_**Example**_:

URI: `/flights/5`

Response:
```js
{
  "arrival_at": "Tue, 16 Nov 2021 22:06:00 GMT", 
  "business_remaining": 0, 
  "city": "Tokyo", 
  "departure_at": "Mon, 01 Nov 2021 22:06:00 GMT", 
  "direction": 5, 
  "distance": 1, 
  "duration": 15000000, 
  "econom_remaining": 0, 
  "id": 5
}
```

___
### Get available tickets on flight

`GET /flights/{flight_id}/tickets`

_**Example**_:

URI: `/flights/2/tickets`

Response:
```js
{
  "business": [
    {
      "price": 200, 
      "seat": 27
    }, 
    {
      "price": 200, 
      "seat": 28
    }, 
    {
      "price": 200, 
      "seat": 29
    }
  ], 
  "econom": []
}
```
___
### Get my info
`GET /account`

_**Authentication required!**_

_**Example**_:

URI: `/account`
Response:
```js
{
  "bonuses": 100, 
  "user_id": 1
}
```
___
### Delete my account
`DELETE /account`

___

### Get orders and bonuses history

`GET /account/history`

_**Example**_: 

URI: `/account/history`:

```js
{
  "orders": [
    {
      "bonuses_added": "7024", 
      "bonuses_used": "100", 
      "created_at": "Sun, 28 Nov 2021 22:02:57 GMT", 
      "order_id": 3, 
      "state": 1, 
      "tickets": [
        {
          "flight": {
            "arrival_at": "Tue, 30 Nov 2021 17:12:00 GMT", 
            "departure_at": "Tue, 30 Nov 2021 11:34:00 GMT", 
            "direction": {
              "id": 4, 
              "to": {
                "city": "London", 
                "id": 4, 
                "info": "airport bigger than Novovolynsk", 
                "name": "Heathrow"
              }
            }, 
            "distance": 3512, 
            "id": 4
          }, 
          "price": 150, 
          "seat": 43, 
          "type": 1
        }, 
        {
          "flight": {
            "arrival_at": "Tue, 30 Nov 2021 17:12:00 GMT", 
            "departure_at": "Tue, 30 Nov 2021 11:34:00 GMT", 
            "direction": {
              "id": 4, 
              "to": {
                "city": "London", 
                "id": 4, 
                "info": "airport bigger than Novovolynsk", 
                "name": "Heathrow"
              }
            }, 
            "distance": 3512, 
            "id": 4
          }, 
          "price": 150, 
          "seat": 44, 
          "type": 1
        }
      ]
    }
  ]
}
```


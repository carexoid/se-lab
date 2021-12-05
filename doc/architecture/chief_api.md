## Chief service API documentation

___
### Get all flights

`GET /flights`

Filtering results implemented via optional query parameters.
Possible parameters:


| Name               | Type | Description                                            |
|--------------------|---|--------------------------------------------------------|
| number             | int | Flight number                                          |
| arrival_at         | string | Arrival date, format - "%Y-%m-%d"                      |
| min_departure_time | string | Min departure time, format - "%Y-%m-%d %H:%M:%S"       |
| max_departure_time | string | Min departure time, format - "%Y-%m-%d %H:%M:%S" |    
| min_duration       | int | Min flight duration in seconds                         |
| max_duration       | int | Max flight duration in seconds                         |
| min_price          | int | Min ticket price for flight                            |
| max_price          | int | Max ticket price for flight                            |
| airport            | string | Target airport name                                    |
| city               | string | Target city name                                       |
| business_remaining | int | Minimum amount of business tickets remaining on flight |
| econom_remaining   | int | Minimum amount of econom tickets remaining on flight   |

_**Example**_:

URI: `/flights?business_remaining=1`

Response:
```js
{
    "flights":
    [
        {
            "airport_name": "Boryspil",
            "arrival_at": "Sat, 04 Dec 2021 16:18:00 GMT",
            "business_remaining": 0,
            "city": "Kyiv",
            "departure_at": "Sat, 04 Dec 2021 14:12:00 GMT",
            "direction": 1,
            "distance": 1000,
            "duration": 7560,
            "econom_min_price": null,
            "econom_remaining": 0,
            "id": 1
        },
        {
            "airport_name": "Zhuliany",
            "arrival_at": "Wed, 08 Dec 2021 22:12:00 GMT",
            "business_remaining": 3,
            "city": "Kyiv",
            "departure_at": "Wed, 08 Dec 2021 18:00:00 GMT",
            "direction": 2,
            "distance": 1400,
            "duration": 15120,
            "econom_min_price": null,
            "econom_remaining": 0,
            "id": 2
        },
        {
            "airport_name": "Frankfurt Airport",
            "arrival_at": "Thu, 02 Dec 2021 14:40:00 GMT",
            "business_remaining": 1,
            "city": "Frankfurt",
            "departure_at": "Thu, 02 Dec 2021 12:55:00 GMT",
            "direction": 3,
            "distance": 700,
            "duration": 6300,
            "econom_min_price": null,
            "econom_remaining": 0,
            "id": 3
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
  "airport_id": 2, 
  "airport_name": "Zhuliany", 
  "arrival_at": "Wed, 08 Dec 2021 22:12:00 GMT", 
  "business_min_price": 200, 
  "business_remaining": 3, 
  "city": "Kyiv", 
  "departure_at": "Wed, 08 Dec 2021 18:00:00 GMT", 
  "direction": 2, 
  "distance": 1400, 
  "duration": 15120, 
  "econom_min_price": null, 
  "econom_remaining": 0, 
  "id": 2
}
```
___
### Get cities

`GET /cities`

_**Example**_:

URI: `/cities`

Response:
```js
{
  "cities": [
    {
      "city": "Kyiv"
    }, 
    {
      "city": "Kyiv"
    }, 
    {
      "city": "Frankfurt"
    }, 
    {
      "city": "London"
    }, 
    {
      "city": "Tokyo"
    }, 
    {
      "city": "Chernivtsi"
    }, 
    {
      "city": "Guangzhou"
    }, 
    {
      "city": "Atlanta"
    }
  ]
}
```
___
### Get flight ids

`GET /flight_ids`

_**Example**_:

URI: `/flight_ids`

Response:
```js
{
  "ids": [
    1, 
    2, 
    3, 
    4, 
    5, 
    6, 
    7, 
    8, 
    9, 
    10, 
    11, 
    12, 
    13, 
    14
  ]
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
      "full_price": "300", 
      "order_id": 3, 
      "state": 1, 
      "tickets": [
        {
          "flight": {
            "airport_name": "Heathrow", 
            "arrival_at": "Tue, 30 Nov 2021 17:12:00 GMT", 
            "city": "London", 
            "departure_at": "Tue, 30 Nov 2021 11:34:00 GMT", 
            "distance": 3512, 
            "id": 4
          }, 
          "price": 150, 
          "seat": 43, 
          "type": 1
        }, 
        {
          "flight": {
            "airport_name": "Heathrow", 
            "arrival_at": "Tue, 30 Nov 2021 17:12:00 GMT", 
            "city": "London", 
            "departure_at": "Tue, 30 Nov 2021 11:34:00 GMT", 
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
### Make order

`POST /booking`

Body example:

```js
{
    "tickets": [    // required
        {
            "flight_id": 2,
            "seat": 27
        },
        {
            "flight_id": 2,
            "seat": 28
        }
    ],
    "use_bonuses": 300   // optional    
}
```

If success, response is redirect to checkout



const diff = require('../tang/helpers/difference')

let base = {
  "authId": "8rNg2qTHq0aK1RVWT99Ygg6vgzB2",
  "role": "admin",
  "screenName": "roboncode",
  "email": "roboncode@gmail.com",
  "avatar": "http://facetheforce.today/yoda/200",
  "location": "Miami, FL",
  "firstName": "Robert",
  "lastName": "Taylor",
  "devices": [{name: 'chrome'}]
}

let newData = {
  "authId": "8rNg2qTHq0aK1RVWT99Ygg6vgzB2",
  "role": "admin",
  "screenName": "roboncode",
  "email": "roboncode@gmail.com",
  "firstName": "Rob",
  "lastName": "Taylor",
  "location": "Miami, FL",
  "avatar": "http://facetheforce.today/luke/200",
  "devices": [{
    name: 'chrome'
  }, {
    name: 'ios'
  }],
  "stats": {
    "friends": 1,
    "followers": 1
  }
}

let result = diff(newData, base)

console.log(JSON.stringify(result))
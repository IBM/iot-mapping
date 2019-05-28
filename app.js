var express = require('express');
var path = require('path');

var app = express();
var fs = require('fs');
//var _ = require('underscore');
var animal_data = []

if (fs.existsSync('./map_vals.json')) {
  //file exists
  try {
    animal_data = JSON.parse(fs.readFileSync('./map_vals.json'))
  } catch(err) {
    console.log(err)
    console.log("unable to parse map_vals.json")
    //var animal_data = []
  }
} else {
  console.log("setting animal_data as empty var")
  //var animal_data = []
}

var animal_ids = [...new Set(animal_data.map(item => item['individual-local-identifier']))];
var animal_dict = {}
var id, row

// sort data by tracking id
for (id in animal_ids) {
  animal_dict[ animal_ids[id] ] = []
}
for (row in animal_data) {
   animal_dict[ animal_data[row]['individual-local-identifier'] ].push( animal_data[row] )
}

// for (id in animal_ids) {
//     animal_data.filter(function(element){
//       // console.log( animal_ids[ id ] )
//       animal_dict[ animal_ids[ id ]]
//       return animal_ids[id] ==
//       // return element.age >= 10;
//     })
// }
require('dotenv').config()
var mqttCreds = {
  IOT_DEVICE_ID: process.env.IOT_DEVICE_ID,
  IOT_AUTH_TOKEN: process.env.IOT_AUTH_TOKEN,
  IOT_API_KEY: process.env.IOT_API_KEY,
  IOT_ORG_ID: process.env.IOT_ORG_ID,
  IOT_DEVICE_TYPE: process.env.IOT_DEVICE_TYPE,
  IOT_EVENT_TYPE: process.env.IOT_EVENT_TYPE
}

//fs.readFileSync('.iotenv')
app.get('/', function (req, res) {
  res.sendFile('index.html' , { root : __dirname});
});


app.get('/mqtt_creds', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(mqttCreds));
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('/animal_data', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(animal_dict));
});

app.get('/map_vals.json', function (req, res) {
  // res.send('Hello World!');
  res.sendFile('map_vals.json' , { root : __dirname});
});

app.listen(3000, function () {
  console.log('App listening on port 3000');
});

var express = require('express');
var path = require('path');

var app = express();
var fs = require('fs');
var _ = require('underscore');

var animal_data = JSON.parse(fs.readFileSync('./map_vals.json'))
var animal_ids = [...new Set(animal_data.map(item => item['individual-local-identifier']))];
var animal_dict = {}

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

var mqttCreds = fs.readFileSync('.iotenv')
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

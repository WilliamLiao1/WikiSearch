var express = require('express');
var path = require('path');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

var server = app.listen(3000, function () {
  console.log('WikiSearch listening on port 3000');
});
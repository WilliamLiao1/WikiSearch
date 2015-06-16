var express = require('express');
var path = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

var server = app.listen(app.get('port'), function () {
  console.log('WikiSearch listening on port '+app.get('port'));
});
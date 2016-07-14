var express = require('express');
var fs = require('fs');
var app = express();
var path = __dirname + '/public/';
var bodyParser = require('body-parser');
var async = require('async');

var helpers = require('./server/helper.js');
var yelp = require('./server/externalAPIs/yelp.js')
var wiki = require('./server/externalAPIs/wikipedia.js')

// SET UP
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

var port = process.env.PORT || 1337;
var yelpSearch = require('./server/externalAPIs/yelp.js');
// var request = require('request');

app.use(function(req,res,next) {
  console.log('/' + req.method + ' from ' + req.url);
  next();
});

// INITIAL ENDPOINT ROUTING

// INDEX.HTML - Served when user hits server
app.get('/', function(req, res) {
  // yelpSearch.yelpSearch;
  res.sendFile(path + 'index.html');
});

// app.get('api/getCategories', function(req, res, next) {
//   res.send({categories: ['gifts', 'activities', 'trips', 'food']})
// });

// getIdea - responds to user clicking "GO button" from UI
app.post('/api/getIdea', function(req, res, next) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  })
  req.on('end', function() {
    var category = JSON.parse(body).category;
    helpers.getIdeaList(function(data) {
      helpers.generateRandomIdea(data, category, function(result) {
        res.send(result);
      })
    })
  });
});


// app.post('/api/suggestionDetails', function(req, res, next) {
  // async.parallel({

  //   yelp: function(callback) {
  //     callback(null, yelp.yelpSearch(req.body.suggestion, req.body.location, function(data) {
  //       console.log('Yelp Call Executing: ', data);
  //       res.send(data);
  //     }));
  //   },

  //   wiki: function(callback) {
  //     callback(null, wiki.wikiSearch(req.body.suggestion, function(data) {
  //       console.log('Wiki Call Executing: ', data);
  //       res.send(data);
  //     }));
  //   }
  // }, function(err, results) {
  //   res.send(JSON.stringify(results));
  // })
// })


app.post('/api/yelpDetails', function(req, res, next) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  })
  req.on('end', function() {
    var suggestion = JSON.parse(body).suggestion;
    console.log(suggestion);
    yelp.yelpSearch(suggestion, 94109, 5, function(data) {
      console.log('Yelp Call Executing: ', data);
      res.send(data);
    });
  });
});

app.post('/api/wikiDetails', function(req, res, next) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  })
  req.on('end', function() {
    var suggestion = JSON.parse(body).suggestion;
    console.log(suggestion);
    wiki.wikiSearch(suggestion, function(data) {
      console.log('Wiki Call Executing: ', data);
      res.send(data);
    });
  });
});




app.listen(3000, function() {
  console.log('App listening on port 3000!');

  // do other stuff
  app.use(express.static(__dirname + '/public'))
  app.listen(port, function() {
    console.log('App listening on port 1337')});
});
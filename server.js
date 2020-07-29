// The actual login process involves multiple domains but the
// issue is also reproducible with a single domain

var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var parser = require('body-parser');

var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

app.use(parser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.set('etag', false)

// Landing page, show login button
app.get('/index.html', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// login request
// redirect to correct url

// Sometimes this will cause a blank white screen after the login process (Android only)
// All of the data gets passed back to the parent correctly (logged in state)
app.get('/loginRedirect', function (req, res) {
  res.redirect('/js_redirect');
});

// This the JS redirect here causes issues on iOS (transparent screen iOS 13, black screen iOS 12) 
app.get('/js_redirect', function (req, res) {
  res.sendFile(path.join(__dirname + '/js_redirect.html'));
});


// handle actual login page
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/login.html'));
});

// get info from login and redirect
app.post('/login', function (req, res) {
  var body = req.body;
  console.log(body);
  res.redirect(
    '/confirm?name=' + encodeURIComponent(body.fname + ' ' + body.lname)
  );
});

// Handle post login redirect and send message to parent
app.get('/confirm', function (req, res) {
  res.sendFile(path.join(__dirname + '/confirm.html'));
});

// Serve manifest file
app.get('/manifest', function (req, res) {
  res.sendFile(path.join(__dirname + '/manifest.xml'));
});

app.listen(port, () => console.log(`Listening on ${port}`));

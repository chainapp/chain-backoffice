var express = require('express');
var request = require('request');
var app = express();
var mongoose = require('mongoose');
var config = require('./config/config');
mongoose.connect(config.mongo.url_prod);
app.use(express.static('./'));
var path = require('path');
var Twit = require('twit');
var Facebook = require('facebook-node-sdk');
var ig = require('instagram-node').instagram();
var ejs = require('ejs');
var fs = require('fs');

ejs.open = '{{';
ejs.close = '}}';   

app.use(express.bodyParser());

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
 
// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 
ig.use({ 
    client_id: config.instagram.client_id,
    client_secret: config.instagram.client_secret
});

var facebook = new Facebook({ 
    appId: config.facebook.appId, 
    secret: config.facebook.secret 
}).setAccessToken('940317362659855|407d1ca9220de0cabb69298424bb0868');;

var T = new Twit({
    consumer_key:         config.twitter.consumer_key
  , consumer_secret:      config.twitter.consumer_secret
  , access_token:         config.twitter.access_token
  , access_token_secret:  config.twitter.access_token_secret
})
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport("SMTP",{
    service: 'Gmail',
    auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: config.mailer.defaultFromAddress, // sender address
    to: 'louis.stockreisser@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};


app.post('/notify/:tosend/:to',function(req,res){


//Get email template path
    var jsonBody = req.body;
    console.log(jsonBody);
    var tosend = req.params.tosend
    var template = process.cwd() + '/src/templates/' +tosend+'.ejs';
    var content = this.content;
    var to = req.params.to;
    var subject = 'Hello '+req.body.user+', news from Facefight ✔';

    // Use fileSystem module to read template file

    fs.readFile(template, 'utf8', function (err, file){
        if(err) return console.log(err);

        var html = ejs.render(file, {title:jsonBody.title, content:jsonBody.content});
        
        //ejs.render(file, content); returns a string that will set in mailOptions

        var mailOptions = {
            from: config.mailer.defaultFromAddress,
            to: to,
            subject: subject,
            html: html
        };
        transporter.sendMail(mailOptions, function (err, info){
            // If a problem occurs, return callback with the error
            if(err) return console.log(err);
            console.log(info);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(info));
        });
    });


// send mail with defined transport object

})




var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    creationDate     : Date,
    facebook         : {
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    notification     : {
        enable       : Boolean,
        token        : String
    },
    ranking          : { 
        type:'object', 
        index : true
    }

});

var userModel = mongoose.model('user', userSchema);

var subscriberSchema = mongoose.Schema({

    email        : String,
    registrationDate     : String,
    name         : String

});

var subscriberModel = mongoose.model('subscriber', subscriberSchema);


app.get('/users/newUsersByDay',function(req,res){

userModel.aggregate({$group:{_id:'$creationDate', count:{$sum:1}}}, function (err, data) {
      if (err) { throw err; }
      
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})

app.get('/users/count',function(req,res){

    userModel.find({}, function (err, data) {
        if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data.length));
    });


})


app.get('/users',function(req,res){

    userModel.find({}, function (err, data) {
        if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    });


})

app.get('/subscribers/newSubscribersByDay',function(req,res){

subscriberModel.aggregate({$group:{_id:'$registrationDate', count:{$sum:1}}}, function (err, data) {
      if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})

app.get('/subscribers/count',function(req,res){

    subscriberModel.find({}, function (err, data) {
        if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data.length));
    });


})


app.get('/subscribers',function(req,res){

    subscriberModel.find({}, function (err, data) {
        if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    });


})

app.get('/twitter/followers/count',function(req,res){

    T.get('users/show', { user_id: '2982644231' },  function (err, data, response) {
        if (err) throw err;
     console.log(data);
     var obj = {count:data.followers_count};
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(obj));
    })
})

app.get('/facebook/likes/count',function(req,res){

     /*facebook.api('/oauth/authorize?redirect_uri=http%3A%2F%2Fexample.com', function(err, auth) {
        if (err) console.log(err);
        console.log(auth);*/
        /*facebook.api('/oauth/access_token?client_id=940317362659855&client_secret=407d1ca9220de0cabb69298424bb0868&grant_type=client_credentials', function(err, oauth) {
            if (err) throw err;
            console.log(oauth);*/
             facebook.api('/v2.3/1556073201276412', function(err, data) {
                if (err) console.log(err);
                console.log(data); // => { id: ... }
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(data));
            });
        /* });*/
    // });

   
})



app.get('/instagram/followers/count',function(req,res){
    var accessTokenUrl = 'https://api.instagram.com/oauth/authorize';
 
  var params = {
    client_id: '1540e90cb61e49e68126fba704960dc9',
    client_secret: '4be769b2460c4cc2bdc791ff03222e4f',
    response_type: 'token',
    grant_type: 'token'
  };
 
    // Step 1. Exchange authorization code for access token.
    request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {
       console.log(body);
   });
 
      


})


app.listen(process.env.PORT || 8081);

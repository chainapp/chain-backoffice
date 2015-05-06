var express = require('express');
var request = require('request');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/facefight');
app.use(express.static('./'));
var Twit = require('twit')
var Facebook = require('facebook-node-sdk');
var ig = require('instagram-node').instagram();
 
// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 
ig.use({ client_id: '1540e90cb61e49e68126fba704960dc9',
         client_secret: '4be769b2460c4cc2bdc791ff03222e4f' });
var facebook = new Facebook({ appId: '940317362659855', secret: '407d1ca9220de0cabb69298424bb0868' }).setAccessToken('940317362659855|407d1ca9220de0cabb69298424bb0868');;

var T = new Twit({
    consumer_key:         'KUV58xsSCCzfiV7UZLJXXehCa'
  , consumer_secret:      'sQIbBuI835JkLzWTe4LS60Xho5rd7EiPfK4gN5thAZlxn5DtT8'
  , access_token:         '2982644231-5DfibM9TzYX9cKby0xRxOVFYX6t00bKtFz6RScB'
  , access_token_secret:  'AAHZzex4QnOBSM9StDt7HN3D13uUJYPYTfKz5OOhkWEI5'
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

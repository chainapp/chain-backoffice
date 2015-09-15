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
var ObjectId = mongoose.Schema.Types.ObjectId;

ejs.open = '{{';
ejs.close = '}}';   

app.use(express.bodyParser());

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 
// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 
ig.use({ 
    client_id: config.instagram.client_id,
    client_secret: config.instagram.client_secret
});

var facebook = new Facebook({ 
    appId: config.facebook.appId, 
    secret: config.facebook.secret 
}).setAccessToken('7b56e8e62de7d686b47eabc55fa7eac6');;

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

var eventSchema = mongoose.Schema({

    type        : String,
    class      : String, 
    title     : String,
    date         : Date,
    details     : String

});

var eventModel = mongoose.model('event', eventSchema);


app.post('/notify/:tosend/:to',function(req,res){


//Get email template path
    var jsonBody = req.body;
    console.log(jsonBody);
    var tosend = req.params.tosend
    var template = process.cwd() + '/templates/' +tosend+'.ejs';
    var content = this.content;
    var to = req.params.to;
    var subject = 'Hello '+req.body.user+', news from Chain';

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

            var e = new eventModel();
            e.type = "send";
            e.class = "info"; 
            e.title = "Mail news"
            e.date = new Date();
            e.details = "To "+to+" : "+jsonBody.content;
            e.save(function(err,savedEvent){
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(info)); 
            })    
           
        });
    });


// send mail with defined transport object

})




var userSchema = mongoose.Schema({
    username : { type: String, required: true, index : true },
    profilePicture : String,
    local            : {
        /*email        : String,
        password     : String,*/
    },
    facebook         : {
    },
    twitter          : {
    },
    google           : {
    },
    notification     : {
        enable       : Boolean,
        token        : String
    },
    chains          : [
        {
            type: ObjectId, 
            ref: 'Chains', 
            required: true, 
            index : true
        }
    ],
    chains_count : Number,
    followers          : {
                type: ObjectId, 
                ref: 'Followers', 
                required: true, 
                index : true
    },
    followers_count : Number,
    follows : {
                type: ObjectId, 
                ref: 'Follows', 
                required: true, 
                index : true
    },
    follows_count : Number,
    created_at     : Date,
    updated_at     : Date,
    last_connected_at : Date,
    is_public      : Boolean,
    access_token   : String,
    refresh_token  : String,
    views_count    : Number,
    isLoggedIn : Boolean
});

var userModel = mongoose.model('user', userSchema);

var subscriberSchema = mongoose.Schema({

    email        : String,
    registrationDate     : String,
    name         : String

});

var subscriberModel = mongoose.model('subscriber', subscriberSchema);

app.get('/subscribe',function(req,res){
    var name = req.query.name;
    var mail = req.query.mail;
    var date = new Date();
    var sub = new subscriberModel();
    sub.email=mail;
    sub.name=name;
    sub.date=date;

    sub.save(function(err,saved){
        if (err) throw err;
        res.send('OK');
    })
})

app.get('/users/newUsersByDay',function(req,res){

userModel.aggregate({$group:{_id:{ $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }, count:{$sum:1}}}, function (err, data) {
      if (err) { throw err; }
        
        console.log(data);
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

subscriberModel.aggregate({$group:{_id:{ $dateToString: { format: "%Y-%m-%d", date: "$registrationDate" } }, count:{$sum:1}}}, function (err, data) {
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


var chainSchema = mongoose.Schema({
    title : { type: String, index : true },
    original_picture_s3 :  {
        type: ObjectId, 
        ref: 'Pictures', 
        required: true, 
        index : true
    },
    original_picture_s3_url: String,
    current_picture_s3 : {
        type: ObjectId, 
        ref: 'Pictures', 
        required: true, 
        index : true
    },
    current_picture_s3_url: String,
    author : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    chainers : [
        {
            user : {
                type: ObjectId, 
                ref: 'Users', 
                required: true, 
                index : true
            },
            picture : {
                type: ObjectId, 
                ref: 'Picture', 
                required: true, 
                index : true
            }
        }
        
    ],
    created_at     : Date,
    updated_at     : Date,
    expire_at   : { type: String, index : true },
    status  : String,
    type : String,
    comments : [
        {
            username : String,
            user : {
                type: ObjectId, 
                ref: 'Users', 
                required: true, 
                index : true
            },
            date : Date,
            content : String,
            profilePicture : String
        }
    ],
    likes : [
        {
            username : String,
            user : {
                type: ObjectId, 
                ref: 'Users', 
                required: true, 
                index : true
            },
            date : Date
        }
    ],
    views_count    : Number
});

var chainModel = mongoose.model('chain', chainSchema);


app.get('/chains',function(req,res){

    chainModel.find({}, function (err, data) {
        if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    });


})

app.get('/chains/newChainsByDay',function(req,res){

chainModel.aggregate({$group:{_id:{ $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }, count:{$sum:1}}}, function (err, data) {
      if (err) { throw err; }
        
        console.log(data);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})

app.get('/chains/chainersByChain',function(req,res){

chainModel.aggregate({
    $unwind: "$chainers"
},
{
    $group: {
        _id: "$_id",
        size: {
            $sum: 1
        }
    }
},
{
    $group: {
        _id: "$size",
        frequency: {
            $sum: 1
        }
    }
},
{
    $project: {
        chainers: "$_id",
        frequency: 1,
        _id: 0
    }
}, function (err, data) {
      if (err) { throw err; }
        
        console.log(data);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})

app.get('/chains/chainsByChainer',function(req,res){

chainModel.aggregate({$group:{_id: "$author" , count:{$sum:1}}}, function (err, data) {
      if (err) { throw err; }
        
        console.log(data);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})

app.get('/twitter/followers/count',function(req,res){

    T.get('users/show', { user_id: '3395509019' },  function (err, data, response) {
        if (err) throw err;

        console.log('twitter data');
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
             facebook.api('/v2.4/1556073201276412?fields=likes', function(err, data) {
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
    client_id: 'c19252edc1e9436cba927839cbb7e4ae',
    client_secret: 'd10e115de1d045fb9575d918e106e3fb',
    response_type: 'token',
    grant_type: 'token'
  };
 
    // Step 1. Exchange authorization code for access token.
    request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {
       console.log(body);
   });


 
      


})


app.get('/events',function(req,res){

eventModel.find({}, function (err, data) {
        if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    });


})

app.listen(process.env.PORT || 8081);

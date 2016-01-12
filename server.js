var express = require('express');
var request = require('request');
var passport = require('passport');
var flash    = require('connect-flash');
var app = express();
var session      = require('express-session');
var mongoose = require('mongoose');
var config = require('./config/config');
var User = require('./models/user');
var Follows = require('./models/follows');
var Followers = require('./models/followers');
var Chain = require('./models/chain');
var Picture = require('./models/picture');
var Thumbnail = require('./models/thumbnail');
var Invite = require('./models/invite');
var Friends = require('./models/friends');
var Forbidden = require('./models/forbidden');
var Chainv2 = require('./models/chainv2');
var Chainer = require('./models/chainer');
var Like = require('./models/like');
var Comment = require('./models/comment');
var Matrix = require('./models/matrix');
var Tag = require('./models/tag');
var Invitev2 = require('./models/invitev2');
var UserNotif = require('./models/userNotification');
var Notification = require('./models/notification');
var Notificationv2 = require('./models/notificationv2');
var UserNotification = require('./models/userNotification');
var Stats = require('./models/stats.js');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var async = require('async');
var math = require('mathjs');
var fs = require('fs');
var multer  = require('multer');
var AWS = require('aws-sdk');
mongoose.connect(process.env.DB_URL || config.mongo.url_prod);
require('./config/passport')(passport);
app.use( express.cookieParser() );
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true}));
app.use( session({secret: 'chainisawesome'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 
require('./config/auth.js')(app, passport); 

app.use(function(req, res, next) {
    console.log(req.user);
    if (req.user == undefined)
    {
        res.redirect('/login');
    }else{

        next();
        
    }
    
})
app.use(express.static(__dirname + '/')); 
app.use(express.static(__dirname + '/dist')); 
app.use(express.static(__dirname + '/boostrap'));
app.use(express.static(__dirname + '/plugins'));
// app.get('/' ,function(req, res) {
//           app.use('/', express.static('./')); // load the index.ejs file
//      });


//app.use(express.static('./'));
var path = require('path');
var Twit = require('twit');
var Facebook = require('facebook-node-sdk');
var ig = require('instagram-node').instagram();
var ejs = require('ejs');   
var fs = require('fs');
var ObjectId = mongoose.Schema.Types.ObjectId;
var moment = require('moment');
var async = require('async');

// ejs.open = '{{';
// ejs.close = '}}';   

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


function compareDates(a,b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}

app.get('/stats/activeUsers',function(req,res){
    
    var result = [];

    Stats.aggregate(
        { $group:{ _id:{ date : {$dateToString: { format: "%Y-%m-%d", date: "$date" }}, user_id  :'$user_id' } }},
        { $group:{ _id:{ date:'$_id.date', type:"day"}, count:{$sum:1}}},
        function (err, data) {
      if (err) { throw err; }

      for (var i = 0 ; i < data.length ; i++){
        var metric = {};
        metric.date = data[i]._id.date+" 12:00";
        metric.daily = data[i].count;
        result.push(metric  );
      }

      Stats.aggregate(
        { $group:{ _id:{ date : {$dateToString: { format: "%Y-%m-%d %H:00", date: "$date" }}, user_id  :'$user_id' } }},
        { $group:{ _id:{ date:'$_id.date', type:"hour"}, count:{$sum:1}}},
        function (err, data) {
          if (err) { throw err; }
          for (var i = 0 ; i < data.length ; i++){
            var found = false;
            for (var j = 0 ; j < result.length; j++){
                if (result[j].date == data[i]._id.date){
                    result[j].hourly = data[i].count;
                    found = true;
                }
            }
            if (!found){
                var metric = {};
                metric.date = data[i]._id.date;
                metric.hourly = data[i].count;
                result.push(metric);
            }
           
          }
          res.send(result.sort(compareDates));  
      }) 
    })
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

mongoose.set('debug',true);

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



app.get('/users/runningUsers',function(req,res){

    var a = moment('2015-09-01');
    var b = moment(new Date());
    var result = [];
    var moments = [];

    for (var m = a; m.isBefore(b); m.add('days', 1)) {
      moments.push(m.format('YYYY-MM-DD'));
    }
    moments.push(m.format('YYYY-MM-DD'));

    async.eachSeries(moments,function(day,callback){
        userModel.find({"created_at": {"$lte": new Date(day)}},function (err, data) {
        if (err) { throw err; }
        result.push({
            date:day,
            users:data.length
        })
        callback();
      });
    },function(err){
        //res.writeHead(200, {"Content-Type": "application/json"});
        res.status(200).send(result);
    })
    




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


// var forbiddenSchema = mongoose.Schema({
//     tag : { type: String, index : true },
//     created_at     : Date
// });

// forbiddenSchema.set('versionKey', false);

// // create the model for users and expose it to our app
// var forbiddenModel  = mongoose.model('Forbiddens', forbiddenSchema);

app.get('/v2/chains/changeType/:chainId',function(req,res){
    var chainId = req.params.chainId;
    Chainv2.findById(chainId, function (err, chain) {
        if (err) { throw err; }
        if (chain.type == 'PUBLIC'){
            chain.type = 'PRIVATE';
        }else{
            chain.type = 'PUBLIC';
        }
        chain.save(function(err){
            if (err) throw err;
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(chain));
        })
        
    });


})


app.get('/v2/chains/:chainId', function(request, response, next){
    
    var chainId = request.params.chainId;


    Chainv2.findById(chainId).populate({
          path: 'chainers author'
        }).exec(function(err,chain){
            if (err) throw err;
                var result = JSON.parse(JSON.stringify(chain));
                result.likes_count = chain.likes.length;
                result.comments_count = chain.comments.length;
                result.chainers_count = chain.chainers_count;
                

                delete result.matrix;
                delete result.likes;
                delete result.comments;
                delete result.current_picture_s3;
                delete result.original_picture_s3;

                response.status(200).send(result);
        })
});
app.get('/v2/chains/:start/:end', function(request, response, next){
    
    var start = request.params.start;
    var end = request.params.end;
    var tag = request.query.tag;
    var pattern = request.query.pattern;
    var type = request.query.type;

    if (start === null) {
        logger.error('start not provided.');
        response.setHeader('Content-Type', 'text/plain');
        response.send(400, "Property start is not provided");
        return;
    }

    if (end === null) {
        logger.error('end not provided.');
        response.setHeader('Content-Type', 'text/plain');
        response.send(400, "Property end is not provided");
        return;
    }

    var search = {};
    if (tag){
        search.tag = tag;
    }
    if (pattern){
        search.title = new RegExp(pattern.trim(), 'i')
    }
    if (type){
        search.type = type;
    }


    Chainv2.find(search,
        {},
        {
            skip:start, // Starting Row
            limit:(end-start), // Ending Row
            sort:{
                created_at: -1 //Sort by Date Added DESC
            }
        }).populate({
          path: 'chainers author'
        }).exec(function(err,chains){
            if (err) throw err;
            var results = [];
            async.eachSeries(chains,function(chain,callback){
                var result = JSON.parse(JSON.stringify(chain));
                result.likes_count = chain.likes.length;
                result.comments_count = chain.comments.length;
                result.chainers_count = chain.chainers_count;
                

                delete result.matrix;
                delete result.likes;
                delete result.comments;
                delete result.current_picture_s3;
                delete result.original_picture_s3;

                results.push(result);
                callback();
            },function(err){
                if (err) throw err;
                response.status(200).send(results);
            })
        })
});



app.delete('/v2/chains/:chainId',function(req,res){
    var chainId = req.params.chainId;
    Chainv2.find({_id:chainId}).remove().exec(function (err, chain) {
        if (err) { throw err; }
        
        Invitev2.find({chain:chainId}).remove().exec(function (err, invites) {
            if (err) { throw err; }

            Chainer.find({chain:chainId}).remove().exec(function(err,chainers){
                if (err) { throw err; }

                UserNotification.find({chain_id:chainId}).remove().exec(function(err,userNotifs){
                    if (err) { throw err; }
                    res.end('Chain deleted');
                })

            })

           
        })
        
    });
})

app.delete('/v2/chainers/:chainerId',function(req,res){
    var chainerId = req.params.chainerId;

    Chainer.findById(chainerId,function(err,chainer){
            if (err) throw err;
            
            if (!chainer){
                res.send(404, null);
                return;
            }

            Chainv2.findById(chainer.chain,function(err,chain){
                if (err) throw err;


            Matrix.findById(chain.matrix,function(err, matrix){
                if (err) throw err;

                var newMatrix = math.matrix(matrix.matrix);
                newMatrix.subset(math.index(chainer.position.y, chainer.position.x),0); 
                matrix.matrix = newMatrix;

                //console.log(matrix.matrix);

                chainer.remove(function(err){
                    if (err) throw err;

                    Chainer.find({chain:chain._id}).distinct('user',function(err,chainers){
                        if (err) throw err;

                        chain.chainers_count = chainers.length;
                        chain.updated_at = new Date();
                        if (chainerId.toString() == chain.author.toString()){
                            chain.author = null;
                        }else{
                            chain.chainers.remove(chainer._id);
                        }
                        
                        matrix.save(function(err){
                            if (err) throw err;
                            chain.save(function(err){
                                if (err) throw err;
                                var result = JSON.parse(JSON.stringify(chain));
                                result.likes_count = chain.likes.length;
                                result.comments_count = chain.comments.length;
                                result.chainers_count = chain.chainers_count;
                                

                                delete result.matrix;
                                delete result.likes;
                                delete result.comments;
                                delete result.current_picture_s3;
                                delete result.original_picture_s3;
                                res.status(200).send(result);

                            })
                        })
                        
                    })

                })
            })
        })
        })
})

app.get('/chains',function(req,res){

    chainModel.find({}, function (err, data) {
        if (err) { throw err; }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    });


})

app.get('/chains/changeType/:chainId',function(req,res){
    var chainId = req.params.chainId;
    chainModel.findById(chainId, function (err, chain) {
        if (err) { throw err; }
        if (chain.type == 'PUBLIC'){
            chain.type = 'PRIVATE';
        }else{
            chain.type = 'PUBLIC';
        }
        chain.save(function(err){
            if (err) throw err;
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(chain));
        })
        
    });


})

app.get('/chains/forbiddens', function(request, response, next){

    forbiddenModel.find({},
        {}, // Columns to Return
        {
            sort:{
                date_added: -1 //Sort by Date Added DESC
            }
    },function(err,forbiddens){
            if (err)
                response.send(err);

            response.send(forbiddens);
        });

});


app.post('/chains/forbiddens', function(request, response){

    var tag = request.body.tag;
    var date = new Date();

    Forbiddens = new forbiddenModel();
    Forbiddens.tag = tag;
    Forbiddens.created_at = new Date();

    Forbiddens.save(function(err,saved){
        if (err) throw err;
        response.send('OK');
    })
});

app.get('/chains/newChainsByDay',function(req,res){

chainModel.aggregate({$group:{_id:{ $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }, count:{$sum:1}}}, function (err, data) {
      if (err) { throw err; }
        
        console.log(data);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})

app.get('/chains/newChainsV2ByDay',function(req,res){

Chainv2.aggregate({$group:{_id:{ $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }, count:{$sum:1}}}, function (err, data) {
      if (err) { throw err; }
        
        console.log(data);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})


app.get('/chains/chainsByType',function(req,res){

chainModel.aggregate(
    { $group: { _id: "$type", count: { $sum: 1 }}}, function (err, data) {
      if (err) { throw err; }
        
        //console.log(data);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
      });


})




app.get('/chains/chainersByChain',function(req,res){

Chainv2.aggregate({
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


app.get('/chains/topChainers',function(req,res){

userModel.aggregate(
    { $unwind: "$chains" }, 
    { $group: { _id: {"username":"$username","profilePicture":"$profilePicture"}, chains: { $addToSet: "$chains" } } }, 
    { $unwind:"$chains" }, 
    { $group : {_id : "$_id", count : {$sum : 1} } },
    { $sort: { count: -1}}
    , function (err, data) {
      if (err) { throw err; }
        
        //console.log(data);
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

// var notificationSchema = mongoose.Schema({
//     message : String,
//     type : String,
//     lang : String
// });

// var notificationModel  = mongoose.model('Notifications', notificationSchema);


app.get('/notifications',function(req,res){

    Notifications.find({},function(err,notifs){
        if (err) throw err;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(notifs));
    })

})

app.get('/v2/notifications',function(req,res){

    Notificationv2.find({},function(err,notifs){
        if (err) throw err;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(notifs));
    })

})

app.put('/notifications/:id',function(req,res){

    var notifId = req.params.id;
    var message = req.body.message;
    var type = req.body.type;
    var lang = req.body.lang;

    Notifications.findById(notifId,function(err,notif){
        if (err) throw err;

        notif.message = message;
        notif.type = type;
        notif.lang = lang;

        notif.save(function(err){
            if (err) throw err;
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(notif));
        })

        
    })

})

app.post('/notifications',function(req,res){

    console.log(req.body);
    var message = req.body.message;
    var type = req.body.type;
    var lang = req.body.lang;



        notif = new Notifications();
        notif.message = message;
        notif.type = type;
        notif.lang = lang;
        console.log(notif);
        notif.save(function(err){
            if (err) throw err;
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(notif));
        })

})



app.get('/retention/:start/:end',function(req,res){
    var start = req.params.start;
    var end = req.params.end;
    var a = moment(start);
    var b = moment(end);
    var result = [];
    var moments = [];

    for (var m = a; m.isBefore(b); m.add('days', 1)) {
      moments.push(m.format('YYYY-MM-DD'));
    }
    //moments.push(m.format('YYYY-MM-DD'));

    async.eachSeries(moments,function(day,callback){
        var dayMinus30 = moment(new Date(day)).add('days',-30);
        var dayMinus29 = moment(new Date(day)).add('days',-29);

        var dayMinus7 = moment(new Date(day)).add('days',-7);
        var dayMinus6 = moment(new Date(day)).add('days',-6);

        var dayMinus1 = moment(new Date(day)).add('days',-1);
        var current = new Date(day);

        var next = moment(new Date(day)).add('days',1);

        User.find({"created_at": {"$gte": new Date(dayMinus30),"$lte": new Date(dayMinus29)}},'_id created_at',function (err, users) {
            if (err) { throw err; }
            var users30 = users;
            var userIds = []
            for (var i = 0 ; i < users.length ; i++){
                userIds.push(users[i]._id);
            }

            Stats.find({user_id:{$in:userIds},date:{"$gte": new Date(current),"$lte": new Date(next)}}).distinct('user_id',function(err,distincts){
                if (err) throw err;
                var stats30 = distincts;

                User.find({"created_at": {"$gte": new Date(dayMinus7),"$lte": new Date(dayMinus6)}},'_id created_at',function (err, users) {
                    if (err) { throw err; }
                    var users7 = users;
                    var userIds = []
                    for (var i = 0 ; i < users.length ; i++){
                        userIds.push(users[i]._id);
                    }

                    Stats.find({user_id:{$in:userIds},date:{"$gte": new Date(current),"$lte": new Date(next)}}).distinct('user_id',function(err,distincts){
                        if (err) throw err;
                        var stats7 = distincts;

                        User.find({"created_at": {"$gte": new Date(dayMinus1),"$lte": new Date(current)}},'_id created_at',function (err, users) {
                            if (err) { throw err; }
                            var users1 = users;
                            for (var i = 0 ; i < users.length ; i++){
                                userIds.push(users[i]._id);
                            }

                            Stats.find({user_id:{$in:userIds},date:{"$gte": new Date(current),"$lte": new Date(next)}}).distinct('user_id',function(err,distincts){
                                if (err) throw err;
                                var stats1 = distincts;

                                var metric = {date:day};

                                if (users30.length > 0){
                                    metric.retention30 = 100*parseFloat(stats30.length/users30.length).toFixed(2);
                                }else{
                                    metric.retention30 = null;
                                }
                                if (users7.length > 0){
                                    metric.retention7 = 100*parseFloat(stats7.length/users7.length).toFixed(2);
                                }else{
                                    metric.retention7 = null;
                                }
                                if (users1.length > 0){
                                    metric.retention1 = 100*parseFloat(stats1.length/users1.length).toFixed(2);
                                }else{
                                    metric.retention1 = null;
                                }
                                if (metric.retention1 || metric.retention7 || metric.retention30){
                                    result.push(metric);
                                }      
                                callback();
                            });
                        });
                    });
                });
            });
        });
    },function(err){
        //res.writeHead(200, {"Content-Type": "application/json"});
        res.status(200).send(result);
    })
    

})

app.get('/v2/tags',function(req,res){

    Tag.find({},function(err,tags){
        if (err) throw err;
        res.status(200).send(tags);
    })

})

app.post('/v2/tags',function(req,res){

    var tag = req.body.tag;
    var url = req.body.url;
    var priority = req.body.priority;

    var newTag = new Tag();
    newTag.tag = tag;
    newTag.created_at = new Date();
    newTag.s3_picture_url = url+'?timestamp='+(new Date()).getTime();

    newTag.save(function(err){
        if (err) throw err;
        Tag.find({},function(err,tags){
            if (err) throw err;
            res.status(200).send(tags);
        })
    })
})
     
app.put('/v2/tags/:tagId',function(req,res){

    var tagId = req.params.tagId;
    var tagLabel = req.body.tag;
    var s3_picture_url = req.body.s3_picture_url;
    var priority = req.body.priority;

    Tag.findById(tagId,function(err,tag){
        if (err) throw err;

        tag.tag = tagLabel;
        tag.priority = priority;
        tag.created_at = new Date();
        tag.s3_picture_url = s3_picture_url+"?timestamp="+(new Date()).getTime();

        tag.save(function(err){
            if (err) throw err;
            Tag.find({},function(err,tags){
                if (err) throw err;
                res.status(200).send(tags);
            })
        })

        
    })

})

app.delete('/v2/tags/:tagId',function(req,res){

    var tagId = req.params.tagId;

    Tag.findById(tagId).remove().exec(function(err,tag){
        if (err) throw err;
        res.status(200).send('OK');
    })

})


app.get('v2/notifications',function(req,res){

    Notificationv2.find({},function(err,notifs){
        if (err) throw err;
        res.status(200).send(notifs);
    })

})

app.post('v2/notifications',function(req,res){

    var newNotif = new Notificationv2();
    newNotif.message = req.body.message;
    newNotif.type = req.body.type;
    newNotif.lang = req.body.lang;
    newNotif.status = req.body.status;
    newNotif.threshold = req.body.threshold;

    newNotif.save(function(err){
        if (err) throw err;
        Notificationv2.find({},function(err,notifs){
            if (err) throw err;
            res.status(200).send(notifs);
        })
    })

})


app.listen(process.env.PORT || 8081);

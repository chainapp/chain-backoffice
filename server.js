var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://52.17.127.121:27017/facefight');
app.use(express.static('./'));

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

app.listen(process.env.PORT || 8081);

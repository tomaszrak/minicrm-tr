/**
 * Created by Tomek on 2015-10-17.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
require('../models/Users');
require('../models/Contacts');
require('../models/Tasks');
require('../models/UserTypes');
var User = mongoose.model('User');
var Contact=mongoose.model('Contact');
var Task= mongoose.model('Task');
var UserType= mongoose.model('UserTypes');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


router.get('/user', function(req, res, next) {
    User.find(function(err, user){
        if(err){ return next(err); }

        res.json(user);
    });
});
router.post('/user', function(req, res, next) {
    var user = new User(req.body);

    user.save(function(err, contact){
        if(err){ return next(err); }
        res.json(user);
    });
});
router.post('/contact', function(req, res, next) {
    var contact = new Contact(req.body);
    contact.save(function(err, contact){
        if(err){ return next(err); }
        res.json({status:"ADDED"});
    });
});

router.get('/contact', function(req, res, next) {
    Contact.find(function(err, contacts){
        if(err){ return next(err); }

        res.json(contacts);
    });
});
router.post('/task', function(req, res) {
    var task = new Task(req.body);
    console.log(req.body);
    task.save(function(err, contact){
        if(err){ return next(err); }
        res.json({status:"ADDED"});
    });
});

router.get('/task', function(req, res, next) {
    console.log(req.query.user_name);
    if (typeof req.query.user_name == 'undefined') {
    Task.find(function(err, tasks){
            if(err){ return next(err); }

            res.json(tasks);
        console.log("wewnatrz");
        });
    } else
    {
        Task.find({assigned_employee: req.query.user_name}, function (err, tasks) {
            if (err) {
                return next(err);
            }

            res.json(tasks);
        });
    }
});
router.put('/task',function(req, res){

    Task.findOne({ _id: req.body._id }, function (err, task){
        task.status= req.body.status;
        if(typeof req.body.comment!='undefined') {task.comments.push({comment: req.body.comment,user:req.body.user});}
        task.save();
    });
    return res.status(200).json({message: 'OK'});
});
router.get('/usertype',function(req, res){

    UserType.find(function(err, types){
        if(err){ return next(err); }

        res.json(types);
    });

});
router.post('/usertype', function(req, res,next) {
    var userType = new UserType(req.body);

    userType.save(function(err){
        if(err){ return next(err); }
        res.json({status:"ADDED"});
    });
});
router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;
    user.accounttype=req.body.accounttype;
    user.name=req.body.name;
    user.surname=req.body.surname;

    user.setPassword(req.body.password);
    user.save(function(err, contact){
        if(err){ return next(err); }
        res.json({status:"ADDED"});
    });
});
router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Prosze wypelnic wszystkie pola'});
    }

   passport.authenticate('local', function(err, user, info){
        if(err){return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});
module.exports = router;


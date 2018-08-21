var express = require("express") ;
var bodyParser = require("body-parser") ;
var app = express() ;
var morgan = require('morgan') ;
var session = require('express-session');

app.use(morgan('common'));

app.use(session({
    secret : "secret" , 
    resave : false , 
    saveUninitialized : true 
}))
app.use(express.static(__dirname + "/static")) ;
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({ extended:true })) ;

var users = {
    kian : "123" ,
    kiarash : "1234" ,
    kianoosh : "12345"
} ;

app.get("/" , function (req, resp, next) {
    console.log(req.session);
    resp.sendFile(__dirname + "/static/home.html") ;
}) ;
app.get("/login" , function (req, resp, next) {
    resp.sendFile(__dirname + "/static/login.html") ;
}) ;app.post("/signup" , function (req, resp, next) {
    if (req.body.username.length && req.body.password.length >= 4 ){
        users[req.body.username] = req.body.password  ;
        resp.json({ status : true , msg : "sabtenaame shodi ba passworde " + users[req.body.username] }) ;
        console.log(users) ;
    }
    else {
        resp.json({ status : false , msg : "amaliate sbte naam anjam nashod :| "}) ;
    }
}) ;


app.post("/" , function (req, resp, next) {
    console.log("post") ;
}) ;

app.post("/getinfo" , function(req , resp , next ){
    resp.json(req.session);
})
app.post("/login" , function (req, resp, next) {
    for (user in users) {
        if ( req.body['username'] == user ) {
            if (req.body['password'] == users[user]) {
                req.session.auth = { username : req.body.username};
                resp.json( {status : "true" , msg : "login shodi !"} ) ;
                console.log(req.session);
                return ;
            }
            else {
                resp.json( {status : "false" , msg : "password qalat"} ) ;
                return ;
            }
        }
    }
    resp.json( {status : "false" , msg : "user yaft nashod"} ) ;
}) ;


app.post("/signup" , function (req, resp, next) {
    if (req.body.username.length && req.body.password.length >= 4 ){
        users[req.body.username] = req.body.password  ;
        resp.json({ status : true , msg : "sabtenaame shodi ba passworde " + users[req.body.username] }) ;
        console.log(users) ;
    }
    else {
        resp.json({ status : false , msg : "amaliate sbte naam anjam nashod :| "}) ;
    }
}) ;

app.listen(8000) ;
console.log("app running on port 8000") ;


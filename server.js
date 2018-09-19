var express = require("express") ;
var bodyParser = require("body-parser") ;
var app = express() ;
var morgan = require('morgan') ;
var session = require('express-session');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/nodejspractis");
var db = mongoose.connection ; 

var userShema = new mongoose.Schema({
    email : String , 
    username : String , 
    password : String
});

var usermodel = mongoose.model("user" , userShema) ; 

// var amir = new usermodel({
//     name : "amir" , 
//     age : 20 , 
//     username : "ami70rdehghan"
// }) ; 

// console.log(amir) ;
// console.log(amir.age) ; 

// amir.save(function(err , amir){
//     if (err) { throw err}
//     console.log(amir);
// })


// db.on('error', function(){
//     console.log(' vasl nashodi') ; 
//});
db.once("connected" , function(){
    console.log("connected. ");
});

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
    amir : "123" ,
    ali : "1234" ,
    hasan : "12345"
} ;

var comments = {
    "amir" : ["salam"] ,
    "ali" : ["msg ali ."]
} ; 

app.get("/" , function (req, resp, next) {
    console.log(req.session);
    resp.sendFile(__dirname + "/static/home.html") ;
}) ;
app.get("/login" , function (req, resp, next) {
    resp.sendFile(__dirname + "/static/login.html") ;
});

app.post("/getinfo" , function(req , resp , next ){
    resp.json(req.session.auth);
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

app.post("/logout" , function( req , resp , next){
    req.session.auth = {} ; 
    resp.json({ status : true , msg : " logout shodi "}); 
});


//app.post("/signup" , function (req, resp, next) {
    // var formData = req.body;

    // if( formData.username.length && formData.password.length ){
    //     if (formData.password.length >= 4 ){
    //         usermodel.find({username : formData.username} , function(err , users){
    //             if(err ) { throw err} 
    //             else if (users != undefined ){
    //                 resp.json({ status : false , msg : " user tekrari . "})
    //             } 
    //             else {
    //                 var newuser = new usermodel({
    //                     email : formData.email || " " , 
    //                     password : formData.password , 
    //                     username : formData.username
    //                 });
    //                 console.log(newuser);
    //                 newuser.save();
    //                 resp.json({ status : true , msg : " sabte nam shodi :| "});
    //             }
    //         })
    //     }
    //     else{
    //         resp.jsont({ status : false , msg : " passwor kotah ast "});
    //     }
    // }else {
    //     resp.json({ status : false , msg : "filed hahe ejbari kamel shavad ." })
    // }

    app.post("/signup" , function (req, resp, next) {
        var formData = req.body ;
        if ( formData.username.length && formData.password.length ) {
            if ( formData.password.length >= 4 ) {
                usermodel.find({username : formData.username} , function (err, users) {
                    if (err ) { throw err}
                    else if ( users.length ) {
                        resp.json({status : false , msg : "usere tekrari !  :( " })
                    }
                    else {
                        var newUser = new usermodel({
                            username : formData.username,
                            password : formData.password,
                            email : formData.email 
                        });

                        console.log(newUser) ;
                        newUser.save() ;
                        resp.json({status : true , msg : "sabtenam ba movafaghiat anjam shod .  "}) ;
                     }
                })
            }
            else {
                resp.json({status : false , msg : "password bayad 4 ta bashe ya bishtar ! "} ) ;
            }
        }
        else {
            resp.json({status : false , msg : "username ya passowrd nadari ! :| "}) ;
        }
    
    }) ;


    // if (req.body.username.length && req.body.password.length >= 4 ){
    //     users[req.body.username] = req.body.password  ;
    //     resp.json({ status : true , msg : "sabtenaame shodi ba passworde " + users[req.body.username] }) ;
    //     console.log(users) ;
    // }
    // else {
    //     resp.json({ status : false , msg : "amaliate sbte naam anjam nashod :| "}) ;
    // }
//}) ;

app.post("/submitcomment" , function(req , resp , next){
    if (req.session.auth['username'] != undefined){  // karbar user mibashad . 
            if( comments[req.session.auth.username] != undefined ) {
                comments[req.session.auth.username].push(req.body.msg) // matne comment dakhele araye update mishavad .
            }else{
                comments[req.session.auth.username] = (req.body.msg) // matne comment dakhele araye zakhire mishavad .
            }
            console.log(comments);
            resp.json({status : true , msg : "comment zakhireh shod . "})
    } else {
        resp.json({status : false , msg : " lotfan login shavid "})
    }
}); 

app.post("/getComment" , function(req , resp , next ){
    resp.json(comments);
})

app.listen(8000) ;
console.log("app running on port 8000") ;

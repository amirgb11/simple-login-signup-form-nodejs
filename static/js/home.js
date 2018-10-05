$(document).ready(function () {
    var isAuth = false ;

    $("#login").click(function () {
        //console.log({ username : $("#username").val() ,password :  $("#password").val() }) ;
        $.post("/login" , { username : $("#username").val() ,password :  $("#password").val() } , function (data) {
            $("#info").append("<p>" + data['status'] + " || " + data['msg'] + " </p>") ;
            if (data['status']) {
                getInfo() ;
            };
        });
    }) ;

    $("#signUp").click(function () {
        $.post("/signup" ,{ username : $("#signUpUser").val() ,password :  $("#signUpPass").val() ,email : $("#signUpEmail").val() } , function (data) {
            $("#info").append("<p>" + data['status'] + " || " + data['msg'] + " </p>") ;
        });
    }); 


    // authentication
    $.post("/getInfo" , function (data) {
        $("#auth").html(JSON.stringify(data)) ;
        console.log(data) ; 
    }) ;
 

    $("#submitcomment").click(function(){
    if(isAuth){
        $.post("/submitcomment" , {msg : $("#msg").val()} , function(data){
            console.log(data);
            $("#info").append("<p>" + data['status'] + " || " + data['msg'] + " </p>") ;
            getComment();
        })
    }
    else{
        alert(" :| ")
    }
    });

    $("#submitcomment").click(function(){
        $("#Pcomment").css({ display: "block" });
    })
    
    var getInfo = function () {
        $("#commentBox").empty() ;
        $.post("/getInfo" , function (data) {
            if (data['status']) {
                isAuth = true ;
                getComment();
                $("#auth").html(JSON.stringify(data['status'])) ;
            }
            else {
                $("#auth").html("unknown user") ;
            }
        }) ;
    }  ;

    var getComment = function () {
        $.post("/getComment" , {} , function (data) {
            data.forEach(function (cm , index) {
                console.log(index , cm) ;
                $("#commentBox").append("<p> " + cm.user + " mige : " + cm.text + "</p>") ;
            });
        }) ;
    } ;

    getComment();

    $("#logout").click(function(){
        $.post("/logout" , function(data){
            $("#info").append("<p> " + data.status + " || " + data.msg + "</p> " );
            if (data['status']) {
                getInfo() ;
            }
             
        })
    })


}) ;
$(document).ready(function () {
    var isAuth = false ;

    $("#login").click(function () {
        //console.log({ username : $("#username").val() ,password :  $("#password").val() }) ;
        $.post("/login" , { username : $("#username").val() ,password :  $("#password").val() } , function (data) {
            $("#info").append("<p>" + data['status'] + " || " + data['msg'] + " </p>") ;
        })
    }) ;

    $("#signUp").click(function () {
        $.post("/signup" ,{ username : $("#signUpUser").val() ,password :  $("#signUpPass").val() } , function (data) {
            $("#info").append("<p>" + data['status'] + " || " + data['msg'] + " </p>") ;
        })
    }); 


    // authentication
    $.post("/getinfo" , function(data){
        $("#auth").html(JSON.stringify(data));
        if (data) {
            $("#user").html(data.username);
            isAuth = true;
        }
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
    
    var getComment = function (){
        $.post("/getComment" , {} , function(data){
            for( var attr in data){
                $("#commentbox").append( "<p> " + attr + " : " + data[attr].toString() + " </p> ");
            }
        })
    }; 

    $("#logout").click(function(){
        $.post("/logout" , function(data){
            $("#info").append("<p> " + data.status + " || " + data.msg + "</p> " ); 
        })
    })


}) ;
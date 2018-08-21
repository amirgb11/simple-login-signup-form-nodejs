$(document).ready(function () {
    $("#login").click(function () {
        console.log({ username : $("#username").val() ,password :  $("#password").val() }) ;
        $.post("/login" , { username : $("#username").val() ,password :  $("#password").val() } , function (data) {
            $("#info").append("<p>" + data['status'] + " || " + data['msg'] + " </p>") ;
        })
    }) ;

    $("#signUp").click(function () {
        $.post("/signup" ,{ username : $("#signUpUser").val() ,password :  $("#signUpPass").val() } , function (data) {
            $("#info").append("<p>" + data['status'] + " || " + data['msg'] + " </p>") ;
        })
    }); 

    $.post("/getinfo" , function(data){
        $("#auth").html(JSON.stringify(data));
        if (data) {
            $("#user").html(data['username']);
        }
    }) ; 



}) ;
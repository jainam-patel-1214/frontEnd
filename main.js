$(document).ready(function () {
    $("#d3,#d4,#d5").hide();
    // document.querySelector("#myFromRegister button").disabled=true

    $("#myFromRegister").submit(function (e) { 
        e.preventDefault();
        let valuemail = $("#mail").val();
        let doReset = true
        
        if (valuemail == ""){
            alert("empty email")
            doReset=false
        }
        let valuepwd = $("#pwd").val();
        if (valuepwd == ""){
            alert("empty password")
            doReset=false
        }
        
        if (doReset==true){console.log("email is - ",valuemail,"password is - ",valuepwd);this.reset()}
    });
    $("#myFrom").submit(function (e) { 
        e.preventDefault();
        let valuemail = $("#name").val();
        let doReset = true
        
        if (valuemail == ""){
            alert("empty name")
            doReset=false
        }
        let valuepwd = $("#age").val();
        if (valuepwd == ""){
            alert("empty age")
            doReset=false
        }
        let valueReview = $("#comment").val();
        if (doReset==true){console.log("email is - ",valuemail,"---password is - ",valuepwd,"---review - ",valueReview);this.reset()}
    });

    $("#d1").click(function () {
        $("#d2,#d1").animate({ opacity: 0 }, 500)
            .promise().done(function () {
                $("#d2,#d1").hide();
                $("#d3,#d5").show(500).animate({ opacity: 1 }, 500);;
            });
    });

    $("#d2").click(function () {
        $("#d2,#d1").animate({ opacity: 0 }, 500)
            .promise().done(function () {
                $("#d2,#d1").hide();
                $("#d4,#d5").show(500).animate({ opacity: 1 }, 500);;
            });
    });

    $("#d5").click(function () {
        $("#d3,#d5").animate({ opacity: 0 }, 500)
            .promise().done(function () {
                $("#d3").hide();
                if ($("#d5").css("display")=="block") {
                    $("#d5").hide();
                }
                if ($("#d4").css("display")=="block") {
                    $("#d4").hide();
                }
                $("#d1,#d2").show(500).animate({ opacity: 1 }, 500);
            });
    });
});

function submitQuiz() {
    if ($("#politicsSlider").val() >= 20 || $("#spiritualSlider").val() > 34 || $("#petsSlider1").val() <= -60) {
        failQuiz();
    } else {
        $("#quiz").hide();
        $("html").css("overflow", "auto");
    }
}

function failQuiz() {
    $("#rickRoll, #rejection").show();
    $("#quiz div, #content").remove()
    $("#rejection h1").css("opacity", "100%");
    setTimeout(() => {
        $("#rejection h2").css("opacity", "100%");
        setTimeout(() => {
            $("audio")[0].play();
            $("#quiz").css("opacity", "0%");
            $("#rickRoll").addClass("move");
            setTimeout(() => {
                $("#rejection *").addClass("rainbow");
                setTimeout(() => {
                    $("#rejection").css("opacity", "0%");
                    setTimeout(() => {
                        $("#rejection *").removeClass("rainbow");
                        $("#rejection h1").text("You're still here?");
                        $("#rejection h2").text("Why? Who hurt you?");
                        $("#rejection").css("opacity", "100%");
                    }, 180000);
                }, 10000);
            }, 1000);
        }, 1000);
    }, 2000);
    setTimeout(() => {
        $("#quiz").remove();

    }, 6000);
    setTimeout(() => {
        $("#rickRoll").addClass("slide");
        $("#rickRoll").removeClass("move");
    }, 15000);
}

function sliderChange(slider, val) {
    if (slider == "indoorOutdoorSlider") {
        if (val > 60) {
            $("#outdoorsMsg").text("I love the Outdoors");
        } else if (val > 20) {
            $("#outdoorsMsg").text("I like the Outdoors");
        }
        else if (val > -20) {
            $("#outdoorsMsg").text("I tolerate the Outdoors");
        }
        else if (val > -60) {
            $("#outdoorsMsg").text("I don't love the Outdoors");
        } else {
            $("#outdoorsMsg").text("I'd like to stay inside, thanks'");
        }
    } else if (slider == "sportsSlider") {
        if (val > 85) {
            $("#sportsMsg").text("I'm a sports fanatic");
        } else if (val > 60) {
            $("#sportsMsg").text("I love watching sports");
        } else if (val > 20) {
            $("#sportsMsg").text("I like watching sports");
        } else if (val > -20) {
            $("#sportsMsg").text("I tolerate watching sports");
        } else if (val > -60) {
            $("#sportsMsg").text("I don't prefer watching sports");
        } else {
            $("#sportsMsg").text("I hate sports ball");
        }
    } else if (slider == "petsSlider1") {
        if (val < -20) {
            $("#petsSlider2, #petsMsg2").hide()
        } else if (val > 20) {
            $("#petsSlider2, #petsMsg2").show()
        }
        if (val > 85) {
            $("#petsMsg1").text("I'm obsessed with pets");
        } else if (val > 60) {
            $("#petsMsg1").text("I love pets");
        } else if (val > 20) {
            $("#petsMsg1").text("I like pets");
        } else if (val > -20) {
            $("#petsMsg1").text("I tolerate pets");
        } else if (val > -60) {
            $("#petsMsg1").text("I don't prefer pets");
        } else {
            $("#petsMsg1").text("I hate pets");
        }
    } else if (slider == "petsSlider2") {
        if (val > 80) {
            $("#petsMsg2").text("Only cats");
        } else if (val > 60) {
            $("#petsMsg2").text("I love cats, tolerate dogs");
        } else if (val > 20) {
            $("#petsMsg2").text("I prefer cats");
        } else if (val > -20) {
            $("#petsMsg2").text("I like both equally");
        } else if (val > -60) {
            $("#petsMsg2").text("I prefer dogs");
        } else if (val > -80) {
            $("#petsMsg2").text("I love dogs, tolerate cats");
        } else {
            $("#petsMsg2").text("Only dogs");
        }
    } else if (slider == "spiritualSlider") {
        if (val > 75) {
            $("#spititualMsg").text("Religon is a very big part of my life");
        } else if (val > 35) {
            $("#spititualMsg").text("I consider myself religous");
        } else if (val > 15) {
            $("#spititualMsg").text("I'm somewhat religous");
        } else if (val > -20) {
            $("#spititualMsg").text("I more spiritual than religous");
        } else if (val > -50) {
            $("#spititualMsg").text("I'm not very religous");
        } else if (val > -70) {
            $("#spititualMsg").text("I'm not religous, but respect others' beliefs");
        } else if (val > -85) {
            $("#spititualMsg").text("Religous people are crazy");
        } else {
            $("#spititualMsg").text("I see no difference between religon and cults");
        }
    } else if (slider == "politicsSlider") {
        if (val > 90) {
            $("#politicsMsg").text("Heil Trump and the new third reich");
        } else if (val > 50) {
            $("#politicsMsg").text("I am very conservative");
        } else if (val > 20) {
            $("#politicsMsg").text("I am conservative");
        } else if (val > 0) {
            $("#politicsMsg").text("I probably lean conservative");
        } else if (val > -20) {
            $("#politicsMsg").text("I probably lean progressive");
        } else if (val > -50) {
            $("#politicsMsg").text("I am progressive");
        } else if (val > -90) {
            $("#politicsMsg").text("I am very progressive");
        } else {
            $("#politicsMsg").text("Let's seize the means of production");
        }
    }
}
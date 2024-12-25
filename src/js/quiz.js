function passFailQuiz() {
    if ($("#politicsSlider").val() >= 20 || $("#spiritualSlider").val() > 34 || $("#pets1Slider").val() <= -60) {
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
    } else if (slider == "pets1Slider") {
        if (val < -20) {
            $("#pets2Slider, #pets2Msg").hide()
        } else if (val > 20) {
            $("#pets2Slider, #pets2Msg").show()
        }
        if (val > 85) {
            $("#pets1Msg").text("I'm obsessed with pets");
        } else if (val > 60) {
            $("#pets1Msg").text("I love pets");
        } else if (val > 20) {
            $("#pets1Msg").text("I like pets");
        } else if (val > -20) {
            $("#pets1Msg").text("I tolerate pets");
        } else if (val > -60) {
            $("#pets1Msg").text("I don't prefer pets");
        } else {
            $("#pets1Msg").text("I hate pets");
        }
    } else if (slider == "pets2Slider") {
        if (val > 80) {
            $("#pets2Msg").text("Only cats");
        } else if (val > 60) {
            $("#pets2Msg").text("I love cats, tolerate dogs");
        } else if (val > 20) {
            $("#pets2Msg").text("I prefer cats");
        } else if (val > -20) {
            $("#pets2Msg").text("I like both equally");
        } else if (val > -60) {
            $("#pets2Msg").text("I prefer dogs");
        } else if (val > -80) {
            $("#pets2Msg").text("I love dogs, tolerate cats");
        } else {
            $("#pets2Msg").text("Only dogs");
        }
    } else if (slider == "spiritualSlider") {
        if (val > 75) {
            $("#spiritualMsg").text("Religon is a very big part of my life");
        } else if (val > 35) {
            $("#spiritualMsg").text("I consider myself religous");
        } else if (val > 15) {
            $("#spiritualMsg").text("I'm somewhat religous");
        } else if (val > -20) {
            $("#spiritualMsg").text("I more spiritual than religous");
        } else if (val > -50) {
            $("#spiritualMsg").text("I'm not very religous");
        } else if (val > -70) {
            $("#spiritualMsg").text("I'm not religous, but respect others' beliefs");
        } else if (val > -85) {
            $("#spiritualMsg").text("Religous people are crazy");
        } else {
            $("#spiritualMsg").text("I see no difference between religon and cults");
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
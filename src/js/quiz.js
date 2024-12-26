function passFailQuiz(force) {
    if ($("#politicsSlider").val() >= 20 || $("#spiritualSlider").val() > 34 || $("#pets1Slider").val() <= -60) {
        $("#quiz").css("transition", "ease-in-out 5s")
        $("#submitQuiz, #skipQuiz").remove();
        $("#submit").remove();
        $("#tab1 h2").text("Uh oh... " + totalMatchPercent() + "% Match");
        $("#tab1 h2").css("color", "red");
        setTimeout(() => {
            failQuiz();
        }, 2000);
    } else {
        if (force) {
            passQuiz();
            return;
        }
        $("#tab1 h2").text("It's a Match! " + totalMatchPercent() + "%")
        $("#tab1 h2").css("color", "blue");
        $("#tab1 h2").css("font-weight", "bolder");
        $("#submitQuiz, #skipQuiz").remove();
        $("#continueQuiz").show();
    }
}

function passQuiz() {
    $("#rickRoll, #rejection").remove();
    $("#quiz").css("opacity", "0%");
    $("html").css("overflow", "auto");
    setTimeout(() => {
        $("#quiz").remove();
    }, 3000);
}

// background: linear-gradient(to right, #9c0000 50%, #4b78ca 55%, #00ac09 100%);
function gradientBuilder(gradientList) {
    if (gradientList.length % 2 != 0) {
        console.error("Gradient list must have an even number of values");
        return;
    }
    var gradientString = "linear-gradient(to right";

    for (var i = 0; i < gradientList.length; i += 2) {
        gradientString += ", " + gradientList[i] + " " + gradientList[i + 1] + "%";
    }
    gradientString += ")";
    return gradientString;

}

function setBackground(match, matt, difference) {
    match = (Number(match) + 100) / 2 || 0;
    matt = (Number(matt) + 100) / 2 || 0;
    var lighterColor = "lightgreen";
    var darkerColor = "green";

    var white = "white";

    if (difference > 80) {
        lighterColor = "#ff7676";
        darkerColor = "red";
    } else if (difference > 60) {
        lighterColor = "orange";
        darkerColor = "#ff8c00";
    } else if (difference > 30) {
        lighterColor = "#feff75";
        darkerColor = "#ffcc00";
    }

    // background: linear-gradient(to right, #9c0000 50%, #4b78ca 55%, #00ac09 100%);
    var firstPercent;
    var secondPercent;
    if (match < matt) {
        firstPercent = match;
        secondPercent = matt;
    } else {
        firstPercent = matt;
        secondPercent = match;
    }
    if (difference < 25) {
        if (firstPercent < 25) {
            return gradientBuilder(
                [darkerColor, 0,
                    darkerColor, (firstPercent - 1),
                    white, firstPercent,
                    white, secondPercent,
                    darkerColor, (secondPercent + 1),
                    lighterColor, 100]);
        } else if (secondPercent > 75) {
            return gradientBuilder(
                [lighterColor, 0,
                    darkerColor, (firstPercent - 1),
                    white, firstPercent,
                    white, secondPercent,
                    darkerColor, (secondPercent + 1),
                    darkerColor, 100]);
        }
    } else {
        var midGap = (firstPercent + secondPercent) / 2;
        return gradientBuilder([
            lighterColor, 0,
            darkerColor, (firstPercent - 3),
            white, (firstPercent - 2), white, (firstPercent + 2),
            darkerColor, (firstPercent + 3),
            difference < 45 ? darkerColor : lighterColor, midGap,
            darkerColor, (secondPercent - 3),
            white, (secondPercent - 2), white, (secondPercent + 2),
            darkerColor, (secondPercent + 3),
            lighterColor, 100]);
    }
}

var resultMap = {};

function initResultMap() {
    resultMap = {
        "nature": -1,
        "sports": -1,
        "pets1": -1,
        "pets2": -1,
        "spiritual": -1,
        "politics": -1
    };
}

function submitQuiz() {
    $("#submitQuiz").attr("disabled", "true");
    $("input[type='range']").addClass("hideThumb")
    $("input[type='range']").attr("disabled");
    $("#tab1 h2").text("Results")
    var sliders = ["nature", "sports", "pets1", "pets2", "spiritual", "politics"];
    var sliderTitles = ["Nature", "Sports", "Pets", "Cats", "Religion", "Politics"];
    var mattVal = [85, 70, 70, 35, -90, -90];
    for (var i = 0; i < sliders.length; i++) {
        setTimeout(function (i) {
            var slider = $("#" + sliders[i] + "Slider");
            var result = Number(slider.val());
            var difference = Math.abs(mattVal[i] - result) / 2;
            var msgText = "#" + sliders[i] + "Msg"
            var matchPerent = 0;
            switch (sliders[i]) {
                case "pets1":
                    if (result < 0) {
                        mattVal[i] = 45;
                        difference = Math.abs(mattVal[i] - result) / 2;
                    }
                    break;
                case "pets2":
                    if (result < 0) {
                        sliderTitles[i] = "Dog Preference";
                        mattVal[i] = 21;
                        difference = Math.abs(mattVal[i] - result) / 2;
                    } else {
                        sliderTitles[i] = "Cat Preference";
                        if (result > 80) {
                            mattVal[i] = 70
                            difference = 2;
                        } else if (result > 60) {
                            mattVal[i] = (result + mattVal[i]) / 2;
                            difference = 5;
                        } else {
                            mattVal[i] = (result + mattVal[i]) / 2;
                            difference = Math.abs(mattVal[i] - result) / 2;
                        }
                    }
                    break;
                case "spiritual":
                    if (result > 0) {
                        mattVal[i] = -71;
                        difference = 100;
                    } else if (result > -20) {
                        mattVal[i] = -80;
                        difference = Math.abs(mattVal[i] - result) / 2;
                    } else if (result > -40) {
                        mattVal[i] = -80;
                        difference = Math.abs(mattVal[i] - result) / 3;
                    } else if (result < -90) {
                        mattVal[i] = result - 10;
                        difference = 0;
                    }
                    break;
                case "politics":
                    if (result > 0) {
                        mattVal[i] = -71;
                        difference = 100;
                    } else if (result > -20) {
                        mattVal[i] = -80;
                        difference = Math.abs(mattVal[i] - result);
                    } else if (result > -40) {
                        mattVal[i] = -80;
                        difference = Math.abs(mattVal[i] - result) / 3;
                    } else if (result < -90) {
                        mattVal[i] = result - 10;
                        difference = 0;
                    }
                    break;
                default:
            }
            difference
            var matchPerent = difference > 100 ? 0 : 100 - Math.floor(difference);
            resultMap[sliders[i]] = matchPerent;
            $(msgText).text(sliderTitles[i] + ": " + matchPerent + "% Match");
            $("#tab1 h2").text("Results: " + totalMatchPercent() + "% Match")
            slider.css("background", setBackground(slider.val(), mattVal[i], difference));
            if (i == sliders.length - 1) {
                passFailQuiz();
            }
        }, i * 500, i);
    }
}

function totalMatchPercent() {
    var total = 0;
    var count = 0;
    for (var key in resultMap) {
        if (resultMap[key] < 0) {
            continue;
        }
        total += resultMap[key];
        count++;
    }
    var total = Math.ceil(total / count);
    if (resultMap["spiritual"] >= 0 && resultMap["politics"] >= 0) {
        if (resultMap["politics"] < 70) {
            return total / 2;
        } else if (resultMap["spiritual"] < 60) {
            return total * .75
        } else if (resultMap["spiritual"] < 40) {
            return total / 2
        }
    }
    if (!total) {
        return 0;
    }
    return total;
}

function rickRollBuilder() {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.autoplay = true;

    const sourceOgg = document.createElement('source');
    sourceOgg.src = 'music/rick-roll.ogg';
    sourceOgg.type = 'audio/ogg';

    const sourceMp3 = document.createElement('source');
    sourceMp3.src = 'music/rick-roll.mp3';
    sourceMp3.type = 'audio/mpeg';

    audio.appendChild(sourceOgg);
    audio.appendChild(sourceMp3);

    const fallbackText = document.createTextNode('Your browser does not support the audio element. Enjoy Rick Astley dancing in silence!');
    audio.appendChild(fallbackText);

    return audio;
}

function failQuiz() {
    $("#rickRoll").css("display", "flex");
    $("#rejection").css("display", "block");
    $("#quiz div, #content").remove()
    $("#rejection h1").css("opacity", "100%");
    setTimeout(() => {
        $("#rejection h2").css("opacity", "100%");
        $("#rickRoll").append(rickRollBuilder());
        setTimeout(() => {
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
    if (slider == "natureSlider") {
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
const lamdaUrl = "https://6heos86veh.execute-api.us-west-2.amazonaws.com/default/games?route=dating";
const NAME = "name";
var quizStats;

function initQuizStats() {
    console.log("first time visitor");
    quizStats = {};
    quizStats['id'] = crypto.randomUUID();
    quizStats['visits'] = 1;
    quizStats['signOut'] = true;
    quizStats['final'] = {};
    quizStats['contact'] = { "submitted": false };
    quizStats['path'] = {
        'natureSlider': {},
        'sportsSlider': {},
        'pets1Slider': {},
        'pets2Slider': {},
        'spiritualSlider': {},
        'politicsSlider': {},
        'name': [],
        'chat': []
    };
    if (location.hostname == '' || location.hostname.includes("local") || location.hostname.includes("file")) {
        quizStats['testing'] = true;
    }
    localStorage.setItem("quizStats", JSON.stringify(quizStats));
}

function signOut() {
    quizStats['signOut'] = true;
    if (!quizStats['history']) {
        quizStats['history'] = {};
    }
    var history = {};
    history['date'] = new Date().toISOString();
    history[NAME] = quizStats[NAME];
    history['contact'] = quizStats['contact'];
    history['interested'] = quizStats['interested'];
    history['chat'] = quizStats['path']['chat'];

    quizStats['history'][new Date().toISOString()] = history;
    quizStats['path']['chat'] = [];
    quizStats[NAME] = null;
    quizStats['contact'] = null;
    quizStats['interested'] = null;
    localStorage.setItem("quizStats", JSON.stringify(quizStats));
    location.reload();
}

function welcomeBack() {
    $(".question, #tab1 button").hide();
    $("#tab1 h2").css("transition", "none");
    if (quizStats[NAME]) {
        $("#tab1 h2").text("Welcome Back " + quizStats[NAME] + "!");
        $("#contactFormName").val(quizStats[NAME]);
        $("#contactFormName").addClass("is-valid");
    } else if (quizStats['overall']) {
        $("#tab1 h2").text("Welcome Back! " + quizStats['overall'] + "% Match");
    } else {
        $("#tab1 h2").text("Welcome Back!");
    }
    if (!quizStats['path']['chat']) {
        quizStats['path']['chat'] = [];
    }
    $("#tab1 h2").css("color", "blue");
    $("#tab1 h2").css("font-weight", "bolder");
    passQuiz();
    localStorage.setItem("quizStats", JSON.stringify(quizStats));
}

function passFailQuiz(force) {
    if ($("#politicsSlider").val() >= 20 || $("#spiritualSlider").val() > 75) {
        $("#quiz").css("transition", "ease-in-out 5s")
        $("#submitQuiz, #skipQuiz").remove();
        $("#submit").remove();
        $("#tab1 h2").text("Uh oh... " + totalMatchPercent() + "% Match");
        $("#tab1 h2").css("color", "red");
        quizStats['signOut'] = true;
        setTimeout(() => {
            failQuiz();
        }, 2000);
    } else {
        if (force) {
            quizStats['signOut'] = true;
            postQuizData(true);
            passQuiz();
            return;
        } else {
            quizStats['signOut'] = false;
        }
        $("#tab1 h2").text("It's a Match! " + totalMatchPercent() + "%")
        $("#tab1 h2").css("color", "blue");
        $("#tab1 h2").css("font-weight", "bolder");
        $("#submitQuiz, #skipQuiz").remove();
        $("#continueQuiz").show();
    }
}

function passQuiz() {
    $("#quiz").css("opacity", "0%");
    $("html").css("overflow", "auto");
    setTimeout(() => {
        $("#quiz").remove();
        setTimeout(() => {
            if (quizStats['visits'] > 1) {
                initChat(true);
            } else {
                initChat(false);
            }
        }, 5000);

    }, 2000);
}

function postQuizData(skip) {
    let now = new Date().toISOString();
    let total = totalMatchPercent();

    quizStats['final'][now] = {};
    if (!skip) {
        quizStats['final'][now]['overall'] = total;
        quizStats['overall'] = total;
    } else {
        quizStats['final'][now]['skip'] = true;
    }

    for (var i = 0; i < sliders.length; i++) {
        var slider = $("#" + sliders[i] + "Slider");
        var result = Number(slider.val());
        quizStats['final'][now][sliders[i]] = result;
    }
    postData();
}

function postData() {
    localStorage.setItem("quizStats", JSON.stringify(quizStats));
    fetch(lamdaUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizStats),
    }).then(res => {
        console.log("Status Code: ", res.status);
        localStorage.setItem("quizStats", JSON.stringify(quizStats));
        if ($("#contactFormSubmit").prop("disabled") == true) {
            $("#collapsableFields").removeClass("show");
            $("#contactFormThanks").show();
        }
        return res.json();
    });
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
        } else {
            var midGap = (firstPercent + secondPercent) / 2;
            return gradientBuilder([
                lighterColor, 0,
                darkerColor, (firstPercent - 3),
                white, (firstPercent - 2), white, (secondPercent + 2),
                darkerColor, (secondPercent + 3),
                lighterColor, 100]);
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

const sliders = ["nature", "sports", "pets1", "pets2", "spiritual", "politics"];


function submitQuiz() {
    $("#submitQuiz").attr("disabled", "true");
    $("#nameInput").attr("disabled", "true");
    $("#contactFormName").val($("#nameInput").val());
    $("input[type='range']").attr("disabled");
    $("#tab1 h2").text("Results")
    var sliderTitles = ["Nature", "Sports", "Pets", "Cats", "Religion", "Politics"];
    var mattVal = [85, 70, 70, 35, -90, -90];
    var nameName = $("#nameInput").val();
    if (nameName && nameName != "") {
        quizStats[NAME] = nameName;
    }
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
                        sliderTitles[i] = "Pet Preference";
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
            var matchPerent = difference > 100 ? 0 : 100 - Math.floor(difference);
            resultMap[sliders[i]] = matchPerent;
            slider.addClass("hideThumb")
            $(msgText).text(sliderTitles[i] + ": " + matchPerent + "% Match");
            $("#tab1 h2").text("Results: " + totalMatchPercent() + "% Match")
            slider.css("background", setBackground(slider.val(), mattVal[i], difference));
            if (i == sliders.length - 1) {
                passFailQuiz();
                postQuizData();
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
    if (resultMap["spiritual"] >= 0) {
        var spiritVal = $("#spiritualSlider").val();
        if (spiritVal > 75) {
            total = total * .15;
        } else if (spiritVal > 35) {
            total = total * .30;
        } else if (spiritVal > 0) {
            total = total * .70;
        }
    }
    if (resultMap["politics"] >= 0) {
        if ($("#politicsSlider").val() > 19) {
            return 0;
        }
        if ($("#politicsSlider").val() > 0) {
            total = total * .20;
        }
    }
    if (!total) {
        return 0;
    }
    return Math.floor(total);
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
            $("#natureMsg").text("I love the Outdoors");
        } else if (val > 20) {
            $("#natureMsg").text("I like the Outdoors");
        }
        else if (val > -20) {
            $("#natureMsg").text("I tolerate the Outdoors");
        }
        else if (val > -60) {
            $("#natureMsg").text("I don't love the Outdoors");
        } else {
            $("#natureMsg").text("I'd like to stay inside, thanks'");
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
            $(".petQ2").css("max-height", "0px");
        } else if (val > 20) {
            $(".petQ2").css("max-height", "60px");
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
            var likeLove = "like";
            if ($("#pets1Slider").val() > 60) {
                likeLove = "love";
            }
            $("#pets2Msg").text("I " + likeLove + " both equally");
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
        } else if (val > 5) {
            $("#spiritualMsg").text("I'm somewhat religous");
        } else if (val > -20) {
            $("#spiritualMsg").text("I more spiritual than religous");
        } else if (val > -50) {
            $("#spiritualMsg").text("I'm not very religous");
        } else if (val > -70) {
            $("#spiritualMsg").text("I'm not religous");
        } else if (val > -85) {
            $("#spiritualMsg").text("I'm anti-religion");
        } else {
            $("#spiritualMsg").text("I hate religious people");
        }
    } else if (slider == "politicsSlider") {
        if (val > 90) {
            $("#politicsMsg").text("Heil Führer Trump");
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
            $("#politicsMsg").text("I'm extremely progressive");
        }
    }
    $("#submitQuiz").prop("disabled", false);
}
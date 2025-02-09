importAll(require.context('../style', false, /\.css$/));
import feather from 'feather-icons';
const mainJsVersion = 1.0;

function importAll(r) {
    r.keys().forEach(r);
}

$(function () {
    feather.replace();
    $("#main-version-span").text(mainJsVersion);

    if (location.hostname == '' || location.hostname.includes("local") || location.hostname.includes("file")) {
        console.log("Localhost detected, skipping service worker registration.");
    } else {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function (error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
            });
        }
    }

    // Get local storage
    if (location.hostname == '' || location.hostname.includes("local") || location.hostname.includes("file")) {
        console.log("Running locally");
    }
    let siteVisit = localStorage.getItem("quizStats");
    if (siteVisit) {
        quizStats = JSON.parse(siteVisit);
        quizStats['visits'] = Number(quizStats['visits']) + 1;
        if (location.hostname == '' || location.hostname.includes("local") || location.hostname.includes("file")) {
            quizStats['testing'] = true;
        }
        if (quizStats["signOut"] === false) {
            welcomeBack();
        } else {
            console.log("Repeat user who signed out");
        }
        if (!quizStats['id']) {
            quizStats['id'] = crypto.randomUUID();
            localStorage.setItem("quizStats", JSON.stringify(quizStats));
        }
    } else {
        initQuizStats();
    }
    $("#submitQuiz").click(function () {
        submitQuiz();
    });
    $("#skipQuiz").click(function () {
        passFailQuiz(true);
    });
    $("#continueQuiz").click(function () {
        passQuiz();
    });
    $("#sign-out").click(function () {
        signOut();
    });
    $("input[type=range]").on("input change", function (e) {
        sliderChange(e.target.id, e.target.value);
    });
    $("input[type=range]").on("change", function (e) {
        quizStats['path'][e.target.id][new Date().toISOString()] = e.target.value;
    });
    $('#load-more-movies').click(loadMovies);
    $('.fold-me').click(function (e) {
        foldFunction(e);
    });
    $('.hobby-cards').on('click', '.next, .last', cardNavClick);
    $('.hobby-cards').on('click', '.expand, .shrink', expandHobbyImg);

    $('.chat-avatar').click(function () {
        toggleChat();
    });
    $("#nameInput").on("focusout", function () {
        quizStats[NAME] = $("#nameInput").val();
        if (!quizStats['path'].hasOwnProperty(NAME)) {
            quizStats['path'][NAME] = [];
        }
        namePath.push($("#nameInput").val());
        quizStats['path'][NAME] = namePath;
    });

    $("#contactFormSubmit").on("click", submitContactForm);

    $("#contactFormPhone").on("focusout", function () {
        if ($("#contactFormPhone").val() != "") {
            $("#contactFormPhone").val(formatPhoneNumber($("#contactFormPhone").val()));
        } else {
            $("#contactFormPhone").removeClass("is-valid");
            $("#contactFormPhone").removeClass("is-invalid");
        }
        buildSubmitName();
    });

    $("#contactFormEmail").on("focusout", function () {
        if ($("#contactFormEmail").val() == "") {
            $("#contactFormEmail").removeClass("is-invalid");
            $("#contactFormEmail").removeClass("is-valid");
        } else if (validateEmail($("#contactFormEmail").val())) {
            $("#contactFormEmail").removeClass("is-invalid");
            $("#contactFormEmail").addClass("is-valid");
        } else {
            $("#contactFormEmail").addClass("is-invalid");
            $("#contactFormEmail").removeClass("is-valid");
        }
        buildSubmitName();
    });

    $("#contactFormMessage").on("focusout keyup", function () {
        if ($("#contactFormMessage").val() == "") {
            $("#contactFormMessage").removeClass("is-valid");
        } else {
            $("#contactFormMessage").addClass("is-valid");
        }
        buildSubmitName();
    });

    $("#contactFormInstagram").on("focusout", function () {
        if ($("#contactFormInstagram").val() == "") {
            $("#contactFormInstagram").removeClass("is-valid");
        } else {
            $("#contactFormInstagram").addClass("is-valid");
        }
        buildSubmitName();
    });

    $("#contactFormName").on("focusout keyup", function () {
        if ($("#contactFormName").val() == "" || $("#contactFormName").val().length < 2) {
            $("#contactFormName").removeClass("is-valid");
            $("#contactFormName").addClass("is-invalid");
        } else {
            $("#contactFormName").addClass("is-valid");
            $("#contactFormName").removeClass("is-invalid");
        }
        buildSubmitName();
    });

    $("#contactFormUpdate").on("click", function () {
        $("#contactFormMessage").val('');
        $("#contactFormMessage").removeClass('is-valid');
        $("#contactFormThanks").hide();
        $("#contactFormSubmit").prop("disabled", false);
        $("#collapsableFields").addClass("show");
    });

    let quizName = document.getElementById('nameInput');
    quizName.addEventListener('keydown', event => nameKeydown(event));
    let nameForm = document.getElementById('contactFormName');
    nameForm.addEventListener('keydown', event => nameKeydown(event));

    initResultMap()
    loadMovies();
    buildHobbyCards();
    setTimeout(() => loadMovies(), 1000);
    setTimeout(() => loadMovies(), 2000);
    setTimeout(function () {
        feather.replace();
    }, 1500);
});

function buildSubmitName() {
    var submitMsg = "Submit";
    if ($("#contactFormName").hasClass("is-valid")) {
        submitMsg = submitMsg + " name";
    }
    if ($("#contactFormInstagram").hasClass("is-valid")) {
        submitMsg = submitMsg + ", instagram";
    }
    if ($("#contactFormEmail").hasClass("is-valid")) {
        submitMsg = submitMsg + ", email";
    }

    if ($("#contactFormPhone").hasClass("is-valid")) {
        submitMsg = submitMsg + ", phone";
    }
    if ($("#contactFormMessage").hasClass("is-valid")) {
        submitMsg = submitMsg + ", message";
    }
    $("#contactFormSubmit").text(submitMsg);
    if (submitMsg != "Submit") {
        $(".chat-avatar .face").css("animation", "none");
    }
}

function submitContactForm() {
    $("#contactFormSubmit").prop("disabled", true);

    let name = $("#contactFormName").val();
    let email = $("#contactFormEmail").val();
    let phone = $("#contactFormPhone").val();
    let message = $("#contactFormMessage").val();
    var count = 0;
    if (name && name != "") {
        quizStats[NAME] = name;
        count++;
    }
    if (quizStats['contact'] == null || quizStats['contact'] == undefined) {
        quizStats['contact'] = {};
    }
    if (email && email != "") {
        quizStats['contact']['email'] = email;
        count++;

    }
    if (phone && phone != "") {
        quizStats['contact']['phone'] = phone;
        count++;

    }
    if (message && message != "") {
        if (quizStats['contact']['message'] == null || quizStats['contact']['message'] == undefined) {
            quizStats['contact']['message'] = [];
        }
        quizStats['contact']['message'].push({ 'time': new Date().toISOString(), 'msg': message });
        count++;

    }
    quizStats['path'][NAME] = namePath;
    if (count > 1) {
        quizStats['contact']['submitted'] = true;
    }
    postData();
}


function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        $("#contactFormPhone").addClass("is-valid");
        $("#contactFormPhone").removeClass("is-invalid");
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    $("#contactFormPhone").addClass("is-invalid");
    $("#contactFormPhone").removeClass("is-valid");
    return phoneNumberString;
}
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

var namePath = [];
var lastKeyBack = false;

function nameKeydown(event) {
    // Checking for Backspace. 
    // 8 = backspace, 46 = delete, 13 = enter, 9 = tab, 189 = minus
    if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 13 || event.keyCode == 9 || event.keyCode == 189) {
        if (lastKeyBack == false && $("#nameInput").val() != "") {
            namePath.push($("#nameInput").val());
        }
        lastKeyBack = true;
    }
}

function toggleChat(forceClose = false) {
    if (!chatTreeStarted) {
        startChatTree();
    } else {
        if (forceClose || $('.chat-window').hasClass('open')) {
            postData();
            $(".chat-bubble button").prop("disabled", true);
            $(".chat-bubble button").css("background-color", "gray");
            $(".chat-entry, .chat-bubble").css("opacity", 0.8)
        } else {
            startChatTree();
        }
        $('.chat-window').toggleClass('open');
    }
}

function foldFunction(e) {
    var targetClass = "";
    var classList = [];
    if (e.target.tagName == "svg") {
        classList = e.target.parentElement.classList;
    } else {
        classList = e.target.classList;
    }
    if (classList.contains('why')) {
        targetClass = 'why';
        $('#whyCollapse').toggleClass('collapsed');
    } else if (classList.contains('instagram')) {
        targetClass = 'instagram';
        $('.instagram-grid').toggleClass('d-none');
    }
}
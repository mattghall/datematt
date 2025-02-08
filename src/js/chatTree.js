function answerQuestion(answer) {
    var lastQuestion = chatTranscript[chatTranscript.length - 1];
    if (lastQuestion === "What is your name?") {
        answer = toTitleCase(answer);
    }
    chat(answer, 'response');
    switch (lastQuestion.question) {
        case "Like what you see?": {
            if (answer === 'Yes') {
                askDelayedQuestion('interested', 'Great! Are you interested in connecting?', 'Yes', 'Maybe', 'No', 'N/A');
            } else if (answer === 'Maybe') {
                askDelayedQuestion('interested', 'Cool. Are you interested in connecting?', 'Yes', 'Maybe', 'No', 'N/A');
            } else {
                chat("That's too bad.", 'prompt');
                askDelayedQuestion('isItMe', 'Is it ME or the website?', 'You (Matt)', 'Website', 'This chat');
            }
            break;
        }
        case "Cool. Are you interested in connecting?":
        case "Great! Are you interested in connecting?":
        case "Are you interested in connecting?": {
            if (answer === 'Yes') {
                chat("Awesome!", "prompt");
                quizStats['interested'] = "yes";
                postData();
                if (!quizStats['name']) {
                    askInputQuestion('name', 'What is your name?', 'Name');
                } else {
                    askDelayedQuestion('contactMethod', 'How can I get in touch with you?', 'Text', 'Instagram', 'Other');
                }
            } else if (answer === 'Maybe') {
                quizStats['interested'] = "maybe";
                askDelayedQuestion('q4me', 'Do you have any questions for me?', 'Yes', 'No');
            } else if (answer === 'N/A') {
                quizStats['interested'] = "N/A";
                chat("Do we already know each other?", 'prompt');
                askDelayedQuestion('doIknowU', 'Who are you?', 'Friend', 'Aquaintance', 'Stranger');
            } else {
                chat("That's too bad.", 'prompt');
                quizStats['interested'] = "no";
                askDelayedQuestion('isItMe', 'Is it ME or the website?', 'You (Matt)', 'Website', 'This chat');
            }
            postData();
            break;
        }
        case "Who are you?": {
            if (answer === 'Friend' || answer === 'Aquaintance') {
                chat("Hi there!", "prompt");
                postData();
                askDelayedQuestion('friendCrush', "Is this like one of those '" + answer +
                    " who might be romantically interested' situations or " + answer +
                    " who's just checking out the site", 'Interested', 'Unsure', 'No');

            } else if (answer === 'Stranger') {
                chat("Hi Stranger! Enjoy getting to know everything about me and let me know if you change your mind about connecting.", "prompt");
            }
            break;
        }
        case "Is this like one of those 'Aquaintance who might be romantically interested' situations or Aquaintance who's just checking out the site":
        case "Is this like one of those 'Friend who might be romantically interested' situations or Friend who's just checking out the site": {
            if (answer === 'Interested') {
                if (quizStats['name'] == "" || quizStats['name'] != "Friend" || quizStats['name'] != "Aquaintance") {
                    askInputQuestion('friendName', "Well, I'm flattered. Who knows, I might feel the same way. Who is this?", "Name");
                } else if (quizStats['contact']) {
                    chat("Cool cool cool. Who knows, I might feel the same way.");
                    askInputQuestion('tellMe', 'Is there anything you would like to tell me?', 'Question');
                }
            } else {
                askQuestion('questionsFromFriend', "Cool, cool cool. Do you have any questions or anything you'd like to know?", "What is this AI chat thing?", "I'm gullible", "other");
            }
            postData();
            break;
        }
        case "Is there anything you would like to tell me?": {
            postData();
            chat("Thanks for the message! Any other questions?", "prompt");
            break;
        }
        case "Well, I'm flattered. Who knows, I might feel the same way. Who is this?": {
            quizStats['name'] = answer;
            chat("Oh hi " + answer + "; I didn't expect to see you (or anyone else) here.", "prompt");
            postData();
            askInputQuestion('tellMe', 'Is there anything you would like to tell me?', 'Question');
            break;
        }
        case "What is your name?": {
            if (answer && answer !== "") {
                delayedChat('Nice to meet you, ' + answer + '!', 'prompt');
            } else {
                delayedChat("Wow I've never met someone with the name '' before. I'm just going to call you Friend instead", 'prompt');
                answer = 'Friend';
            }
            quizStats['name'] = answer;
            postData();
            askDelayedQuestion('contactMethod', 'How can I get in touch with you?', 'Text', 'Instagram', 'Other');
            break;
        }
        case "Let's update your contact info":
        case "How can I get in touch with you?": {
            if (!quizStats['contact']) {
                quizStats['contact'] = {};
            }
            quizStats['contact']['time'] = new Date().toISOString();

            if (answer === 'Text') {
                askInputQuestion('phone', 'What is your phone number?', 'Phone Number');
            } else if (answer === 'Instagram') {
                askInputQuestion('instagram', 'What is your Instagram?', 'Instagram handle');
            } else if (answer === 'Email') {
                askInputQuestion('email', 'What is your email?', 'Email address');
            } else {
                askInputQuestion('otherContact', 'How can I reach you?', 'Contact method');
            }
            break;
        }
        case "What is your phone number?": {
            quizStats['contact']['phone'] = answer;
            reachOutSoon();
            break;
        }
        case "What is your Instagram?": {
            quizStats['contact']['instagram'] = answer;
            reachOutSoon();
            break;
        }
        case "What is your email?": {
            quizStats['contact']['email'] = answer;
            reachOutSoon();
            break;
        }
        case "How can I reach you?": {
            quizStats['contact']['other'] = answer;
            reachOutSoon();
            break;
        }
        case "Is it ME or the website?": {
            if (answer === 'Matt' || answer === 'You (Matt)') {
                setTimeout(() => {
                    $("#rejection h1").text("I guess we're not the best match.");
                    askQuestion("retorical", 'Would you say that I gave you up?', 'Huh?');
                    setTimeout(() => {
                        askQuestion('retorical', 'Would you say I let you down?', 'What?');
                        setTimeout(() => {
                            failQuiz();
                        }, 5000);
                    }, 2000);
                }, 2000);
            } else if (answer === 'Website') {
                askQuestion('tooIntense', 'Yeah I could see how that might be a bit too intense for someone.',
                    'What is this AI chat thing?', "I'm gullible");
            } else if (answer === 'This chat') {
                setTimeout(() => {
                    chat("Would it make you feel better if I said I'm not real?", 'prompt');
                    askDelayedQuestion('imreal', "Well I'm real, but these are just pre-written messages... kind of like a choose your own adventure book",
                        "So you're NOT AI?");
                }, 1000);
            }
            break;
        }
        case "Thanks for the message! Any other questions?":
        case "Cool, cool cool. Do you have any questions or anything you'd like to know?":
        case "No worries. Let me know if you have any questions.":
        case "Yeah I could see how that might be a bit too intense for someone.":
        case "Well I'm real, but these are just pre-written messages... kind of like a choose your own adventure book":
        case "What would you like to know?": {
            if (answer === 'What is this AI chat thing?') {
                chat("Oh I'm not AI, just a nested if tree. I'm AI in the same way that a light switch is AI", 'prompt');
                setTimeout(() => {
                    chatImg("img/chat/isitai.jpg", "prompt");
                }, 1000);
            } if (answer === "So you're NOT AI?") {
                chat("No, I'm just a nested if tree. I'm AI in the same way that a light switch is AI", 'prompt');
                setTimeout(() => {
                    chatImg("img/chat/isitai.jpg", "prompt");
                }, 1000);
            } else if (answer === "I'm gullible") {
                setTimeout(() => {
                    chat('Well since you asked...', 'prompt');
                    setTimeout(() => {
                        failQuiz();
                    }, 2000);
                }, 1000);
            } else if (answer === 'other') {
                askInputQuestion('whatelse', 'What else would you like to know?', 'Question');
            }
            break;
        }
        case "In the meantime, do you have any questions for me?":
        case "Do you have any questions for me?": {
            if (answer === 'Yes') {
                askDelayedQuestion('q4me', 'What would you like to know?', 'What is this AI chat thing?', "I'm gullible", 'other');
            } else {
                chat('OK, then.', 'prompt');
                setTimeout(() => {
                    toggleChat(true);
                }, 2000);
            }
            break;
        }
        case "What else would you like to know?": {
            if (!quizStats['questions']) {
                quizStats['questions'] = [];
            }
            quizStats['questions'].push(answer);
            if (quizStats['contact'] == null) {
                chat("Great question! Let me get your contact info so I can get an answer to you?", "prompt");
                postData();
                askDelayedQuestion('contactForQ', 'How can I get in touch with you?', 'Text', 'Instagram', 'Other');
            } else {
                chat("Great question! I'll get an answer back to you soon", "prompt");
            }
            break;
        }
        case "Have I reached out to you yet?": {
            if (answer === 'Yes') {
                chat("Great!", "prompt");
                setTimeout(() => {
                    toggleChat(true);
                }, 2000);
            } else {
                setTimeout(() => {
                    let difference = new Date() - new Date(quizStats['contact']['time'])
                    // if it's been less than 36hrs
                    if (difference < 1000 * 60 * 60 * 36) {
                        var time = durationText(difference);
                        chat("Looks like you only sent me your contact info " + time + " ago. I'll be sure to reach out soon!", "prompt");
                        askDelayedQuestion('q4me', 'In the meantime, do you have any questions for me?', 'Yes', 'No');
                    } else {
                        chat("Oh no! Let's verify your contact info", "prompt");
                        if (quizStats['name']) {
                            chat(`Name: ${quizStats['name']}`);
                        }
                        if (quizStats['contact']['email']) {
                            chat(`Email: ${quizStats['contact']['email']}`);
                        }
                        if (quizStats['contact']['instagram']) {
                            chat(`Instagram: ${quizStats['contact']['instagram']}`);
                        }
                        if (quizStats['contact']['phone']) {
                            chat(`Phone: ${quizStats['contact']['phone']}`);
                        }
                        if (quizStats['contact']['other']) {
                            chat(`Other: ${quizStats['contact']['other']}`);
                        }
                        askDelayedQuestion("confirmContact", "Does your contact info look correct?", "Yes", "No");
                    }
                }, 500);
            }
            break;
        }
        case "Does your contact info look correct?": {
            if (answer === 'Yes') {
                chat("Great! I must just be busy running or backpacking or something. I'll try to get back to you soon!.", "prompt");
                askDelayedQuestion('q4me', 'In the meantime, do you have any questions for me?', 'Yes', 'No');
                setTimeout(() => {
                    toggleChat(true);
                }, 2000);
            } else {
                chat("Let's update your contact info", "prompt");
                askDelayedQuestion('contactMethod', 'How can I get in touch with you?', 'Text', 'Instagram', 'Other');
            }
            break;
        }
    }

    function durationText(difference) {
        var time = "";
        if (difference < 60 * 1000) {
            time = Math.floor(difference / (1000)) + " seconds";
        } else if (difference < (1000 * 60 * 60)) {
            time = Math.floor(difference / (1000 * 60)) + " minutes";
        } else {
            time = Math.floor(difference / (1000 * 60 * 60)) + " hours";
        }
        return time;
    }
}

function toggleChat(forceClose = false) {
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
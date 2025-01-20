var questionTree = [];

function initChat() {
    $(".chat-window").css("display", "flex");
    questionTree = ["start"];
    if (!quizStats['path']['chat']) {
        quizStats['path']['chat'] = [];
    }
    quizStats['path']['chat'].push({ type: 'info', msg: 'start' })
    setTimeout(() => {
        $('.chat-avatar img').removeClass('hidden');
        setTimeout(() => {
            startChatTree();
        }, 2000);
    }, 2000);
}

function startChatTree() {
    var msg = "Hi";
    if (quizStats['name']) {
        msg += " " + quizStats['name'];
    }
    msg += "! Thanks for visiting";
    if (quizStats['visits'] > 1) {
        msg = msg + " again."
    }
    chat(msg, 'prompt');
    msg = "";
    if (quizStats['interested'] && quizStats['interested'] === "yes") {
        if (quizStats['contact']) {
            msg = 'Have I reached out to you yet?';
        } else {
            chat("It appears I never got your contact info. Let's fix that.", 'prompt');
            askDelayedQuestion('How can I get in touch with you?', 'Text', 'Instagram', 'Other');
            return;
        }
    } else if (quizStats['interested']) {
        msg = 'Are you interested in connecting?'
    } else {
        msg = 'Like what you see?';
    }
    askDelayedQuestion(msg, 'Yes', 'No');
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function askQuestion(question, ...options) {
    questionTree.push(question);
    chat(question, 'prompt');
    setTimeout(() => chatButtons(...options), 1000);
}

function askInputQuestion(question, placeholder) {
    questionTree.push(question);
    chat(question, 'prompt');
    setTimeout(() => createChatInput(placeholder), 1000);
}

function reachOutSoon() {
    postData();
    delayedChat('I\'ll be sure to reach out soon!', 'prompt');
    setTimeout(() => {
        chat('In the meantime, feel free to explore the site.', 'prompt');
        setTimeout(() => {
            chat('You can click my face to minimize the chat btw.', 'prompt');
        }, 1000);
    }, 2000);
}

function createChatInput(placeholder, mask) {
    let chatEntry = $('<div>').addClass('chat-entry').addClass("response");
    let chatBubble = $('<div>').addClass('chat-bubble');
    let inputGroup = $('<div>').addClass('input-group mb-3');
    let chatInput = $('<input>').addClass('form-control').attr('placeholder', placeholder).attr("type", "text");
    let chatButton = $('<button>').addClass('btn btn-primary').attr('type', 'button').text('✓');

    inputGroup.append(chatInput);
    inputGroup.append(chatButton);
    chatButton.on('click', function () {
        let name = $(this).siblings('input').val();
        answerQuestion(name);
        $(this).parent().parent().remove();
    });
    chatBubble.append(inputGroup);
    chatEntry.append(chatBubble);
    $('.chats').append(chatEntry);
}

function askDelayedQuestion(question, ...options) {
    setTimeout(() => askQuestion(question, ...options), 1000);
}
function chat(msg, type) {
    let chatEntry = $('<div>').addClass('chat-entry').addClass(type);
    let chatBubble = $('<div>').addClass('chat-bubble d-flex align-items-center');
    let chatText = $('<p>').addClass('mb-0').text(msg);

    chatBubble.append(chatText);
    chatEntry.append(chatBubble);
    $('.chats').append(chatEntry);
    quizStats['path']['chat'].push({ type: type, msg: msg });
    console.log(type + ": " + msg);
}

function delayedChat(msg) {
    setTimeout(() => chat(msg, "prompt"), 1000);
}

function chatImg(img, type) {
    let chatEntry = $('<div>').addClass('chat-entry').addClass(type).addClass('pic');
    let chatBubble = $('<div>').addClass('chat-bubble pic');
    let chatImg = $('<img>').attr('src', img);

    chatBubble.append(chatImg);
    chatEntry.append(chatBubble);
    $('.chats').append(chatEntry);
}

function chatButtons(...options) {
    let chatEntry = $('<div>').addClass('chat-entry response');
    let chatBubble = $('<div>').addClass('chat-bubble d-flex align-items-center justify-content-between');

    options.forEach((option, index) => {
        let button = $('<button>').addClass('btn mx-1').text(option);
        if (index === 0) {
            button.addClass('btn-primary');
        } else if (index === options.length - 1) {
            button.addClass('btn-danger');
        } else {
            button.addClass('btn-secondary');
        }
        button.on('click', function () {
            answerQuestion($(this).text(), 'response');
            $(this).parent().remove();
        });
        chatBubble.append(button);
    });

    chatEntry.append(chatBubble);
    $('.chats').append(chatEntry);
}


function answerQuestion(answer) {
    var lastQuestion = questionTree[questionTree.length - 1];
    if (lastQuestion === "What is your name?") {
        answer = toTitleCase(answer);
    }
    chat(answer, 'response');
    switch (lastQuestion) {
        case "Like what you see?": {
            if (answer === 'Yes') {
                // resolved
                askDelayedQuestion('Great! Are you interested in connecting?', 'Yes', 'Maybe', 'No');
            } else {
                chat("That's too bad.", 'prompt');
                // resolved
                askDelayedQuestion('Is it ME or the website?', 'You (Matt)', 'Website', 'This chat');
            }
            break;
        }
        case "Great! Are you interested in connecting?":
        case "Are you interested in connecting?": {
            if (answer === 'Yes') {
                chat("Awesome!", "prompt");
                quizStats['interested'] = "yes";
                // resolved
                askInputQuestion('What is your name?', 'Name');
            } else if (answer === 'Maybe') {
                quizStats['interested'] = "maybe";
                // resolved
                askDelayedQuestion('Do you have any questions for me?', 'Yes', 'No');
            } else {
                chat("That's too bad.", 'prompt');
                quizStats['interested'] = "no";
                // resolved
                askDelayedQuestion('Is it ME or the website?', 'You (Matt)', 'Website', 'This chat');
            }
            postData();
            break;
        }
        case "What is your name?": {
            delayedChat('Nice to meet you, ' + answer + '!', 'prompt');
            quizStats['name'] = answer;
            postData();
            // resolved
            askDelayedQuestion('How can I get in touch with you?', 'Text', 'Instagram', 'Other');
            break;
        }
        case "How can I get in touch with you?": {
            if (!quizStats['contact']) {
                quizStats['contact'] = {};
            }
            quizStats['contact']['time'] = new Date().toISOString();

            if (answer === 'Text') {
                // resolved
                askInputQuestion('What is your phone number?', 'Phone Number');
            } else if (answer === 'Instagram') {
                // resolved
                askInputQuestion('What is your Instagram?', 'Instagram handle');
            } else if (answer === 'Email') {
                // resolved
                askInputQuestion('What is your email?', 'Email address');
            } else {
                // resolved
                askInputQuestion('How can I reach you?', 'Contact method');
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
                    askQuestion('Would you say that I gave you up?', 'Huh?');
                    setTimeout(() => {
                        askQuestion('Would you say I let you down?', 'What?');
                        setTimeout(() => {
                            failQuiz();
                        }, 5000);
                    }, 2000);
                }, 2000);
            } else if (answer === 'Website') {
                askQuestion('Yeah I could see how that might be a bit too intense for someone.',
                    'What is this AI chat thing?', 'What does this button do?');
            } else if (answer === 'This chat') {
                setTimeout(() => {
                    chat("Would it make you feel better if I said I'm not real?", 'prompt');
                    // resolved
                    askDelayedQuestion("Well I'm real, but these are just pre-written messages... kind of like a choose your own adventure book",
                        "So you're NOT AI?");
                }, 1000);
            }
            break;
        }
        case "Yeah I could see how that might be a bit too intense for someone.":
        case "Well I'm real, but these are just pre-written messages... kind of like a choose your own adventure book":
        case "What would you like to know?": {
            if (answer === 'What is this AI chat thing?') {
                chat("Oh I'm not AI, just a nested if tree. I'm AI in the same way that a light switch is AI", 'prompt');
                setTimeout(() => {
                    chatImg("img/chat/isitai.jpg", "prompt");
                    delayedChat('You can click my face to minimize the chat btw.');
                }, 1000);
            } if (answer === "So you're NOT AI?") {
                chat("No, I'm just a nested if tree. I'm AI in the same way that a light switch is AI", 'prompt');
                setTimeout(() => {
                    chatImg("img/chat/isitai.jpg", "prompt");
                    delayedChat('You can click my face to minimize the chat btw.');
                }, 1000);
            } else if (answer === 'What does this button do?') {
                setTimeout(() => {
                    chat('Well since you asked...', 'prompt');
                    setTimeout(() => {
                        failQuiz();
                    }, 2000);
                }, 1000);
            } else if (answer === 'other') {
                askInputQuestion('What else would you like to know?', 'Question');
            }
            break;
        }
        case "Do you have any questions for me?": {
            if (answer === 'Yes') {
                // resolved
                askDelayedQuestion('What would you like to know?', 'What is this AI chat thing?', 'What does this button do?', 'other');
            } else {
                chat('OK, then.', 'prompt');
                delayedChat('You can click my face to minimize the chat btw.');
            }
            break;
        }
        case "What else would you like to know?": {
            if (!quizStats['questions']) {
                quizStats['questions'] = [];
            }
            quizStats['questions'].push(answer);
            chat("Great question! Let me get your contact info so I can get an answer to you?", 'prompt');
            postData();
        }
        case "Great question! Let me get your contact info so I can get an answer to you?": {
            // resolved
            askQuestion('How can I get in touch with you?', 'Text', 'Instagram', 'Other');
            break;
        }
        case "Have I reached out to you yet?": {
            if (answer === 'Yes') {
                chat("Great!", "prompt");
                delayedChat('You can click my face to minimize the chat btw.', 'prompt');
            } else {
                setTimeout(() => {
                    let difference = new Date() - new Date(quizStats['contact']['time'])
                    // if it's been less than 36hrs
                    if (difference < 1000 * 60 * 60 * 36) {
                        var time = "";
                        if (difference < 1000) {
                            time = difference / 1000 + " seconds";
                        } else if (difference < (1000 * 60)) {
                            time = difference / (1000 * 60) + " minutes";
                        } else if (difference < (1000 * 60 * 60)) {
                            time = difference / (1000 * 60 * 60) + " hours";
                        }
                        chat("Looks like you only sent me your contact info " + time + " ago. I'll be sure to reach out soon!", "prompt");
                    } else {
                        chat("Oops! I must be busy backpacking or running or volunteering at the animal shelter or something. I'll be sure to reach out soon!", "prompt");
                    }
                    setTimeout(() => {
                        chat('In the meantime, feel free to explore the site.', 'prompt');
                        setTimeout(() => {
                            chat('You can click my face to minimize the chat btw.', 'prompt');
                        }, 1000);
                    }, 2000);
                }, 2000);
            }
            break;
        }
    }
}
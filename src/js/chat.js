var questionTree = [];

function startChat() {
    $(".chat-window").css("display", "flex");
    questionTree = ["start"];
    setTimeout(() => {
        $('.chat-avatar img').removeClass('hidden');
        setTimeout(() => {
            askQuestion('Like what you see?', 'Yes', 'No');
        }, 2000);
    }, 2000);
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
                askDelayedQuestion('Is it ME or the website?', 'Matt', 'Website', 'This chat');
            }
            break;
        }
        case "Great! Are you interested in connecting?": {
            if (answer === 'Yes') {
                chat("Awesome!", "prompt");
                // resolved
                askInputQuestion('What is your name?', 'Name');
            } else if (answer === 'Maybe') {
                // resolved
                askDelayedQuestion('Do you have any questions for me?', 'Yes', 'No');
            } else {
                chat('That\'s too bad.', 'prompt');
                // resolved
                askDelayedQuestion('Is it ME or the website?', 'Matt', 'Website', 'This chat');
            }
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
            postData();
            reachOutSoon();
            break;
        }
        case "What is your Instagram?": {
            quizStats['contact']['instagram'] = answer;
            postData();
            reachOutSoon();
            break;
        }
        case "What is your email?": {
            quizStats['contact']['email'] = answer;
            postData();
            reachOutSoon();
            break;
        }
        case "How can I reach you?": {
            quizStats['contact']['other'] = answer;
            postData();
            reachOutSoon();
            break;
        }
        case "Is it ME or the website?": {
            if (answer === 'Matt') {
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
                    chat('Oh I\'m not real.', 'prompt');
                    // resolved
                    askDelayedQuestion("Well I'm real but these are just pre-written messages like a choose your own adventure book",
                        "So you're NOT AI?");
                }, 1000);
            }
            break;
        }
        case "Yeah I could see how that might be a bit too intense for someone.":
        case "Well I'm real but these are just pre-written messages like a choose your own adventure book":
        case "What would you like to know?": {
            if (answer === 'What is this AI chat thing?') {
                chat('I\'m AI in the same way that a light switch is AI', 'prompt');
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
            }
            break;
        }
        case "Do you have any questions for me?": {
            if (answer === 'Yes') {
                // resolved
                askDelayedQuestion('What would you like to know?', 'What is this AI chat thing?', 'What does this button do?');
            } else {
                chat('OK, then.', 'prompt');
                delayedChat('You can click my face to minimize the chat btw.');
            }
            break;
        }
    }
}
var chatTranscript = [];
var chatTranscriptCodes = [];

function initChat(startChat = true) {
    $(".chat-window").css("display", "flex");
    chatTranscript = ["start"];
    if (!quizStats['path']['chat']) {
        quizStats['path']['chat'] = [];
    }
    quizStats['path']['chat'].push({ type: 'info', msg: 'start' })
    setTimeout(() => {
        $('.chat-avatar img.face').removeClass('hidden');
        setTimeout(() => {
            if (!quizStats.hasOwnProperty("contact") || quizStats['contact']['submitted'] != true) {
                $(".chat-avatar img.face").css("animation", "3s ease 5s infinite normal none running glow");
            }
        }, 1000);
    }, 1000);
}

var chatTreeStarted = false;
function startChatTree() {
    chatTreeStarted = true;
    $(".chat-avatar img.face").css("animation", "none")
    $('.chat-avatar img.close').removeClass('hidden');
    var msg = "Hi";
    if (quizStats['name']) {
        msg += " " + quizStats['name'];
    }
    msg += "! Thanks for visiting";
    if (quizStats['visits'] > 1 && quizStats['name']) {
        msg = msg + " again."
    }
    chat(msg, 'prompt');
    msg = "";
    if (quizStats['interested'] === 'N/A' && quizStats['name'] === 'Friend') {
        delayedChat("Enjoy the site");
        return;
    } else if (quizStats['interested'] === 'N/A' && (quizStats['name'] === 'Aquaintance' || quizStats['name'] === 'Stranger')) {
        delayedChat("Want me to keep calling you " + quizStats['name'] + " or will you share you name?", 'Prompt');
        setTimeout(() => {
            askInputQuestion("keepShortName", 'What is your name?', 'Name');
        }, 2000);
        return;
    }
    if (quizStats['interested'] && quizStats['interested'] === "yes") {
        if (quizStats['contact']) {
            askDelayedQuestion('reachyet', 'Have I reached out to you yet?', 'Yes', 'No');
        } else {
            chat("It appears I never got your contact info. Let's fix that.", 'prompt');
            if (!quizStats['name']) {
                setTimeout(() => {
                    askInputQuestion('name?', 'What is your name?', 'Name');
                }, 1000);
            } else {
                askDelayedQuestion('contactMethod', 'How can I get in touch with you?', 'Text', 'Instagram', 'Other');
            }
            return;
        }
    } else if (quizStats['interested']) {
        if (quizStats['contact'] == null) {
            msg = 'Are you interested in connecting?'
            askDelayedQuestion('interested', msg, 'Yes', 'Maybe', 'No', 'N/A');
        } else {
            askDelayedQuestion('q4me', 'Do you have any questions for me?', 'Yes', 'No');
        }
    } else {
        msg = 'Like what you see?';
        askDelayedQuestion('interested', msg, 'Yes', 'Maybe', 'No');
    }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function askQuestion(key, question, ...options) {
    chatTranscript.push({
        "key": key,
        "type": "choose",
        "question": question,
        "options": [options]
    });
    chat(question, 'prompt');
    setTimeout(() => chatButtons(...options), 1000);
}

function askInputQuestion(key, question, placeholder) {
    chatTranscript.push({
        "key": key,
        "type": "input",
        "question": question,
        "placeholder": placeholder
    });
    chat(question, 'prompt');
    setTimeout(() => createChatInput(placeholder), 1000);
}

function reachOutSoon() {
    quizStats['contact']['submitted'] = true;
    postData();
    delayedChat('I\'ll be sure to reach out soon!', 'prompt');
    setTimeout(() => {
        chat('In the meantime, feel free to explore the site.', 'prompt');
        setTimeout(() => {
            toggleChat(true);
        }, 3000);
    }, 2000);
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

function askDelayedQuestion(key, question, ...options) {
    setTimeout(() => askQuestion(key, question, ...options), 1000);
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